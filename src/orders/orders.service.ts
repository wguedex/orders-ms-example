import {
  Injectable,
  OnModuleInit,
  Logger,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { OrderPaginationDTO } from './dto/order-pagination.dto';
import { ChangeOrderStatusDTO } from './dto';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services';
// import { PRODUCT_SERVICE } from 'src/config';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {
    super();
  }

  private readonly logger = new Logger('OrdersService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  async create(createOrderDto: CreateOrderDto) {

    try {
 
    //Confirmar los ids de los productos
    const productIds = createOrderDto.items.map((item) => item.productId);
    const products: any[] = await firstValueFrom(
      this.client.send({ cmd: 'validate_products' }, productIds),
    );
    
    //Cálculos de los valores
    const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
      const price = products.find(
        (product) => product.id === orderItem.productId,
      ).price;
      return acc + price * orderItem.quantity;
    }, 0);
 
    const totalItems = createOrderDto.items.reduce((acc, orderItem) => {
      return acc + orderItem.quantity;
    }, 0);
    
      //Crear una transacción de base de datos
      const order = await this.order.create({
        data: {
          totalAmount: totalAmount,
          totalItems: totalItems,
          OrderItem: {
            createMany: {
              data: createOrderDto.items.map((orderItem) => ({
                price: products.find(
                  (product) => product.id === orderItem.productId,
                ).price,
                productId: orderItem.productId,
                quantity: orderItem.quantity,
              })),
            },
          },
        },
        include: {
          OrderItem: {
            select: {
              price: true,
              quantity: true,
              productId: true,
            },
          },
        },
      });
 
      return {

        ...order,
        OrderItem: order.OrderItem.map((orderItem) => ({
          ...orderItem,
          name: products.find((product) => product.id === orderItem.productId)
            .name,
        })),

      };

    } catch (error) {

      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Check logs',
      });

    }      

  }
   
  async findAll(orderPaginationDto: OrderPaginationDTO) {
    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status,
      },
    });

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        // skip: (currentPage - 1) * perPage,
        // take: perPage,
        where: {
          status: orderPaginationDto.status,
        },
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.order.findFirst({
      where: { id },
      include: {
        OrderItem: {
          select: {
            price:true,
            quantity: true,
            productId: true
          }
        }
      }
    });

    if (!order) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Order with id ${id} not found`,
      });
    }

    const productIds = order.OrderItem.map( orderItem => orderItem.productId)
    const products: any[] = await firstValueFrom(
      this.client.send({ cmd: 'validate_products' }, productIds),
    );

    return {
      ...order,
      OrderItem: order.OrderItem.map(orderItem=> (
        {
          ...orderItem,
          name:products.find(product=>product.id === orderItem.productId).name
        }
      ))
    };
  }

  async changeStatus(changeOrderStatusDTO: ChangeOrderStatusDTO) {
    const { id, status } = changeOrderStatusDTO;

    const order = await this.findOne(id);

    if (order.status === status) {
      return order;
    }

    return this.order.update({
      where: { id },
      data: {
        status: status,
      },
    });
  }
}

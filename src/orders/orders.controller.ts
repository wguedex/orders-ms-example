import { Controller, NotImplementedException, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderPaginationDTO } from './dto/order-pagination.dto';
import { ChangeOrderStatusDTO } from './dto/change-order-status.dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @MessagePattern('createOrder')
  // create(@Payload() createOrderDto: CreateOrderDto) {
  //   return this.ordersService.create(createOrderDto);
  // }

  @MessagePattern('createOrder')
  async create(@Payload() createOrderDto: CreateOrderDto) {

    // console.log(createOrderDto)

    const order = await this.ordersService.create(createOrderDto); 
    const paymentSession = await this.ordersService.createPaymentSession(order);

    return {
      order,
      paymentSession
    };
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDTO: OrderPaginationDTO) {
    return this.ordersService.findAll(orderPaginationDTO);
  }
  
  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe ) id: string) {
    return this.ordersService.findOne(id);
  }
 
  @MessagePattern('changeOrderStatus')
  async changeStatus(
    @Payload() changeOrderStatusDTO: ChangeOrderStatusDTO
  ){

    return this.ordersService.changeStatus(changeOrderStatusDTO); 
  } 
  

}

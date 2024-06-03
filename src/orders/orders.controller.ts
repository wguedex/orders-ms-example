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

  @MessagePattern('createOrder')
  create(@Payload() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @MessagePattern('findAllOrders')
  findAll(@Payload() orderPaginationDTO: OrderPaginationDTO) {
    return this.ordersService.findAll(orderPaginationDTO);
  }
 

  @MessagePattern('findOneOrder')
  findOne(@Payload('id', ParseUUIDPipe ) id: string) {
    return this.ordersService.findOne(id);
  }

  // @MessagePattern('updateOrder')
  // update(@Payload() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(updateOrderDto.id, updateOrderDto);
  // }

  // @MessagePattern('removeOrder')
  // remove(@Payload() id: number) {
  //   return this.ordersService.remove(id);
  // }

  @MessagePattern('changeOrderStatus')
  async changeStatus(
    @Payload() changeOrderStatusDTO: ChangeOrderStatusDTO
  ){

    return this.ordersService.changeStatus(changeOrderStatusDTO); 
  } 
  

}

import { OrderStatus } from '@prisma/client';
import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsPositive, ValidateNested, arrayMinSize } from 'class-validator';
import { orderStatusList } from '../enum/order.enum';
import { OrderItemDTO } from './order-item.dto';
import { Type } from 'class-transformer';

export class CreateOrderDto {

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({each:true})
  @Type( ()=> OrderItemDTO )
  items: OrderItemDTO[]


  // @IsNumber()  
  // @IsPositive()
  // totalAmount: number;

  // @IsNumber()  
  // @IsPositive()  
  // totalItems: number;

  // @IsEnum( orderStatusList, {
  //   message: `Possible status values are ${orderStatusList}`
  // } )  
  // @IsOptional()
  // status: OrderStatus = OrderStatus.PENDING;

  // @IsBoolean()
  // @IsOptional()
  // paid: boolean = false;

}
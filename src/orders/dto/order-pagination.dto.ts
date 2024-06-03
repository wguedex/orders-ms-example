import { IsEnum, IsOptional } from "class-validator";
import { orderStatusList } from "../enum/order.enum";
import { OrderStatus } from "@prisma/client";
import { PaginationDto } from 'src/common';

export class OrderPaginationDTO  extends PaginationDto{
    @IsOptional()
    @IsEnum(orderStatusList,{
        message: `Validate status are ${orderStatusList}`
    })
    status: OrderStatus
}
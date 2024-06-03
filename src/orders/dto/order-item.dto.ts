import { IsNumber, IsPositive } from 'class-validator';

export class OrderItemDTO {
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsNumber()
  price: number;
}

import { IsIn, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    amount: number;

    @IsNotEmpty()
    @IsIn(['income', 'expense'])
    type: string;
}

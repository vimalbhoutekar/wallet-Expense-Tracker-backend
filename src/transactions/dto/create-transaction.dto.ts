import { IsIn, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateTransactionDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive({ message: 'Amount must be greater than zero' })
    amount: number;

    @IsNotEmpty()
    @IsIn(['income', 'expense'])
    type: string;
}

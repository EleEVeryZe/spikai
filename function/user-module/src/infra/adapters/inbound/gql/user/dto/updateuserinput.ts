import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEmail, MinLength, IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(8)
  password?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class UpdateBusinessStatusDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'active' })
  status: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsJWT, IsNotEmpty, IsString } from 'class-validator';

export class LoginResponseDto {
  @IsJWT()
  @ApiProperty({
    description: 'Access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjYyZjYzY2Q5OGI1MmNjYmUxM2UxZDAxIiwiaWF0IjoxNzE0Mzg0NzM3LCJleHAiOjE3MTQzODY1Mzd9.rUlO7riWCIMx9h8bzvsKv9ejFyhF-Sp9XfNKseCeT-Q',
  })
  accessToken: string;

  @IsJWT()
  @ApiProperty({
    description: 'Refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjYyZjYzY2Q5OGI1MmNjYmUxM2UxZDAxIiwiaWF0IjoxNzE0Mzg0NzM3LCJleHAiOjE3MTQ0MDk5Mzd9.i7LlL1aOspLZP_jxpCd9FVuzyrtt1U-oZZtawsXGUoc',
  })
  refreshToken: string;
}

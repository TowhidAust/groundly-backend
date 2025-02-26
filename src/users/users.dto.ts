import { IsArray, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @IsArray({ message: 'Should Be an array' })
  roles: string[];
}

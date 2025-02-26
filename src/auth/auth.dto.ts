import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'First name is manadatory' })
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsArray({ message: 'Should Be an array' })
  @IsNotEmpty({ message: 'Roles can not be empty' })
  roles: string[];
}

export class LoginUserDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

// import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

// export class RegisterUserDto {
//   @IsString()
//   @IsNotEmpty()
//   nom: string;

//   @IsString()
//   @IsNotEmpty()
//   prenom: string;

//   @IsEmail()
//   @IsNotEmpty()
//   email: string;

//   @IsString()
//   @IsNotEmpty()
//   telephone: string;

//   @IsString()
//   @IsNotEmpty()
//   pays: string;

//   @IsString()
//   @MinLength(4)
//   mdp: string;
// }


import { IsString, IsNotEmpty, IsEmail, MinLength, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  nom: string;

  @IsString()
  @IsNotEmpty()
  prenom: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  telephone: string;

  @IsString()
  @IsNotEmpty()
  pays: string;

  @IsString()
  @MinLength(4)
  mdp: string;
}

export class RegisterUsersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RegisterUserDto)
  users: RegisterUserDto[];
}

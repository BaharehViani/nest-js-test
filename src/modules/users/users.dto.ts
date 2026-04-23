// import { IsString, IsNotEmpty, MinLength, IsUUID } from 'class-validator';
// import { PartialType, ApiProperty } from '@nestjs/swagger'

// export class CreateUserDto {
//   @IsString({ message: 'نام کوچک باید رشته باشد' })
//   @IsNotEmpty({ message: 'نام کوچک نباید خالی باشد' })
//   firstName!: string;

//   @IsString()
//   @IsNotEmpty()
//   @MinLength(2, { message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد' })
//   lastName!: string;

//   @IsString()
//   phoneNumber! : string;

//   @IsString()
//   password? : string;

//   accessPerms: string[] = [];
// }

// // PartialType باعث می‌شود تمام فیلدهای CreateUserDto اختیاری (Optional) شوند
// export class UpdateUserDto extends PartialType(CreateUserDto) {}

// export class UpdateUserQueryDto { 
//   @IsNotEmpty({ message: 'آیدی کاربر الزامی است' })
//   @IsUUID('all', { message: 'فرمت آیدی معتبر نیست' })
//   id!: string;
// }

// export class MetaDto {
//   page!: number;
//   limit!: number;
//   total!:number;
//   totalPages!: number;
// }

// export class UserListResponseDto {
//   code!: number;
//   message!: string;
//   data!: CreateUserDto[];
//   meta!: MetaDto;
// }

// export class UpdateUserResponseDto {
//   message!: string;
// }

// export class CreateUserResponseDto {
//   message!: string;
//   id!: string;
// }
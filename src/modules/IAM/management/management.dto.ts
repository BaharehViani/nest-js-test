import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsArray,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FunctionalPermission } from '@prisma/client';

export class AuthHeaderDto {
  @IsString()
  authorization: string;
}

export class CategoryIdDto {
  @IsString()
  id: string;
}

export class AvatarDto {
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() file_name?: string;
  @IsOptional() @IsString() key?: string;
  @IsOptional() @IsString() mimeType?: string;
}

export class CreateEditUserPermissionBodyDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryIdDto)
  category: CategoryIdDto[];

  @IsArray()
  @IsEnum(FunctionalPermission, { each: true })
  accessPerms: FunctionalPermission[];
}

export class EditUserProfileBodyDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() phoneNumber: string;
  @IsOptional() @IsString() fixPhoneNumber?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() education?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() birthDate?: string;
  @IsOptional() @ValidateNested() @Type(() => AvatarDto) avatar?: AvatarDto;
}

export class GetUserListQueryDto {
  @IsOptional() @IsString() role?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
  @IsOptional() @IsString() search?: string = '';
}

export class GetUserListWithAccessQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
  @IsOptional() @IsString() search?: string = '';
  @IsOptional()
  @IsEnum(FunctionalPermission)
  accessPerms?: FunctionalPermission;
}

export class UserIdQueryDto {
  @IsString() id: string;
}

export class EditUserStatusQueryDto {
  @IsString() userId: string;
  @IsOptional() @Type(() => Boolean) @IsBoolean() status: boolean;
}

export class SendMessageQueryDto {
  @IsString() userId: string;
  @IsString() entityId: string;
  @IsEnum(['OWNER']) type: 'OWNER';
}

export class MessageResponseDto {
  message: string;
}

class UserInListDto {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isActive: boolean;
  avatar: string;
  accessPerms: string[];
}

class PaginationDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserListResponseDto {
  message: string;
  users: UserInListDto[];
  pagination: PaginationDto;
}

export class UserInfoResponseDto {
  message: string;
  data: UserInListDto; 
}
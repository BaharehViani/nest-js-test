import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  Req,
  BadRequestException,
  UnauthorizedException,
  Put,
} from '@nestjs/common';
import { ManagementService } from './management.service';
import * as ManagementDtos from './management.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('ADMIN/MANAGEMENT')
@Controller('admin/management')
export class ManagementController {
  constructor(private managementService: ManagementService) {}

  // -----------------------PUT---------------------
  @Put('editPermission')
  @ApiOkResponse({ type: ManagementDtos.MessageResponseDto })
  async editUserPermission(
    @Headers() headers: ManagementDtos.AuthHeaderDto,
    @Query() query: ManagementDtos.UserIdQueryDto,
    @Body() body: ManagementDtos.CreateEditUserPermissionBodyDto,
    @Req() req: any,
  ) {
    if (!req.userData)
      throw new UnauthorizedException('توکن ارسال شده نامعتبر است');
    const result = await this.managementService.editUserPermissionService(
      req.userData.userId,
      query.id,
      body.category,
      body.accessPerms,
    );
    if (result.code === 1) return { message: result.message };
    throw new BadRequestException(result.message);
  }

  @Put('editProfile')
  @ApiOkResponse({ type: ManagementDtos.MessageResponseDto })
  async editUserProfile(
    @Headers() headers: ManagementDtos.AuthHeaderDto,
    @Query() query: ManagementDtos.UserIdQueryDto,
    @Body() body: ManagementDtos.EditUserProfileBodyDto,
    @Req() req: any,
  ) {
    if (!req.userData) throw new UnauthorizedException('دسترسی نامعتبر است');
    const result = await this.managementService.editUserProfileService(
      req.userData.userId,
      query.id,
      req.body.firstName,
      req.body.lastName,
      req.body.birthDate,
      req.body.phoneNumber,
      req.body.address,
      req.body.education,
      req.body.fixPhoneNumber,
      req.body.email,
      req.body.avatar,
    );
    if (result.code === 1) return { message: result.message };
    throw new BadRequestException(result.message);
  }

  @Put('editStatus')
  @ApiOkResponse({ type: ManagementDtos.MessageResponseDto })
  async editUserStatus(
    @Headers() headers: ManagementDtos.AuthHeaderDto,
    @Query() query: ManagementDtos.EditUserStatusQueryDto,
    @Req() req: any,
  ) {
    if (!req.userData)
      throw new UnauthorizedException('دسترسی کاربر نامعتبر است');
    const result = await this.managementService.editUserStatusService(
      req.userData.userId,
      query.userId,
      query.status,
    );
    if (result.code === 1) return { message: result.message };
    throw new BadRequestException(result.message);
  }

  // -----------------------GET---------------------
  @Get('getList')
  @ApiOkResponse({ type: ManagementDtos.UserListResponseDto })
  async getUserList(
    @Headers() headers: ManagementDtos.AuthHeaderDto,
    @Query() query: ManagementDtos.GetUserListQueryDto,
    @Req() request: any,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const result = await this.managementService.getUserListService(
      query.role,
      query.page,
      query.limit,
      query.search,
    );

    if (result.code === 1) {
      return {
        message: result.message,
        data: result.data,
      };
    }
    throw new BadRequestException(result.message);
  }

  @Get('get')
  @ApiOkResponse({ type: ManagementDtos.UserInfoResponseDto })
  async getUserInformation(
    @Headers() headers: ManagementDtos.AuthHeaderDto,
    @Query() query: ManagementDtos.UserIdQueryDto,
    @Req() request: any,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const result = await this.managementService.getUserInformationService(query.id);

    if (result.code === 1) {
      return {
        message: result.message,
        data: result.data,
      };
    }
    throw new BadRequestException(result.message);
  }

  @Get('getPersonal')
  @ApiOkResponse({ type: ManagementDtos.UserInfoResponseDto })
  async getPersonalInformation(
    @Query() query: ManagementDtos.UserIdQueryDto,
    @Req() req: any,
  ) {
    if (!req.userData) throw new UnauthorizedException('دسترسی نامعتبر است');
    const result = await this.managementService.getPersonalInformationService(
      query.id,
    );
    if (result.code === 1)
      return { message: result.message, data: result.data };
    throw new BadRequestException(result.message);
  }

  @Get('getListWithAccess')
  @ApiOkResponse({ type: ManagementDtos.UserListResponseDto })
  async getListWithAccess(
    @Headers() headers: ManagementDtos.AuthHeaderDto,
    @Query() query: ManagementDtos.GetUserListWithAccessQueryDto,
    @Req() req: any,
  ) {
    if (!req.userData) throw new UnauthorizedException('دسترسی نامعتبر است');
    const result = await this.managementService.getUserListWithAccessService(
      query.page,
      query.limit,
      query.search,
      query.accessPerms,
    );
    if (result.code === 1)
      return { message: result.message, data: result.data };
    throw new BadRequestException(result.message);
  }

  // -----------------------POST---------------------
  @Post('sendMessage')
  @ApiOkResponse({ type: ManagementDtos.MessageResponseDto })
  async messageSender(
    @Headers() headers: ManagementDtos.AuthHeaderDto,
    @Query() query: ManagementDtos.SendMessageQueryDto,
    @Req() req: any,
  ) {
    if (!req.userData) throw new UnauthorizedException('دسترسی نامعتبر است');
    const result = await this.managementService.messageSenderService(
      query.userId,
      query.entityId,
      query.type,
    );
    if (result.code === 1) return { message: result.message };
    throw new BadRequestException(result.message);
  }
}

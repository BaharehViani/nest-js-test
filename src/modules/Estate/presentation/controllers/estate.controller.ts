import {
  Body,
  Headers,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateEstateService } from '../../application/services/create-estate.service';
import { EstateMapper } from '../mappers/estate.mapper';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetEstateService } from '../../application/services/get-estate.service';
import { GetEstatesListService } from '../../application/services/get-estate-list.service';
import { UpdateEstateService } from '../../application/services/update-estate.service';
import { ChangeEstateStatusService } from '../../application/services/change-estate-status.service';
import * as EstateDtos from '../../application/dtos/estate.dto';

@Controller('estates')
export class EstateController {
  constructor(
    private readonly createEstateService: CreateEstateService,
    private readonly getEstate: GetEstateService,
    private readonly getEstatesList: GetEstatesListService,
    private readonly updateEstateService: UpdateEstateService,
    private readonly changeStatusService: ChangeEstateStatusService,
  ) {}

  @Post('createEstate')
  @ApiOkResponse({ type: EstateDtos.GetEstateResponseDto })
  async createEstateController(
    @Req() request: any,
    @Headers() headers: EstateDtos.AuthHeaderDto,
    @Body() body: EstateDtos.CreateEstateDto,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    await this.createEstateService.execute(body);

    return {
      message: 'ملک با موفقیت ساخته شد',
    };
  }

  @Get('getEstate')
  async getEstateByIdController(
    @Req() request: any,
    @Headers() headers: EstateDtos.AuthHeaderDto,
    @Query('id') id: string,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const estate = await this.getEstate.execute(id);
    return {
      message: 'اطلاعات با موفقیت ارسال شد',
      data: EstateMapper.toResponse(estate),
    };
  }

  @Get('getEstateList')
  async getEstateListController(
    @Req() request: any,
    @Headers() headers: EstateDtos.AuthHeaderDto,
    @Query() query: EstateDtos.GetEstatesQueryDto,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const result = await this.getEstatesList.execute(query);

    const totalPages = Math.ceil(result.total / result.limit);

    return {
      message: 'اطلاعات با موفقیت ارسال شد',
      data: result.data.map(EstateMapper.toResponse),
      meta: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: totalPages,
      },
    };
  }

  @Patch('editEstate')
  async updateEstateController(
    @Req() request: any,
    @Headers() headers: EstateDtos.AuthHeaderDto,
    @Query('id') id: string,
    @Body() body: EstateDtos.UpdateEstateDto,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const estate = await this.updateEstateService.execute(id, body);
    return {
      message: 'اطلاعات ملک با موفقیت به روز شد',
      data: EstateMapper.toResponse(estate),
    };
  }

  @Patch('editEstateStatus')
  async changeEstateStatusController(
    @Req() request: any,
    @Headers() headers: EstateDtos.AuthHeaderDto,
    @Query('id') id: string,
    @Body() dto: EstateDtos.ChangeEstateStatusDto,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const estate = await this.changeStatusService.execute(id, dto.status);
    return {
      message: 'وضعیت ملک با موفقیت تغییر کرد',
      data: EstateMapper.toResponse(estate),
    };
  }
}

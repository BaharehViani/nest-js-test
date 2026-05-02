import { Body,Headers, Controller, Get, Param, Patch, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { CreateEstateService } from '../../application/services/create-estate.service';
import { CreateEstateDto } from '../../application/dtos/create-estate-dto';
import { EstateMapper } from '../mappers/estate.mapper';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetEstateResponseDto } from '../../application/dtos/get-estate-response.dto';
import { GetEstatesQueryDto } from '../../application/dtos/get-estates-query.dto';
import { GetEstateService } from '../../application/services/get-estate.service';
import { GetEstatesListService } from '../../application/services/get-estate-list.service';
import { UpdateEstateDto } from '../../application/dtos/update-estate.dto';
import { ChangeEstateStatusDto } from '../../application/dtos/change-estate-status.dto';
import { UpdateEstateService } from '../../application/services/update-estate.service';
import { ChangeEstateStatusService } from '../../application/services/change-estate-status.service';
import { AuthHeaderDto } from '../../application/dtos/auth-header.dto';

@Controller('estates')
export class EstateController {
  constructor(
    private readonly createEstateService: CreateEstateService,
    private readonly getEstate: GetEstateService,
    private readonly getEstatesList: GetEstatesListService,
    private readonly updateEstateService: UpdateEstateService,
    private readonly changeStatusService: ChangeEstateStatusService,
  ) {}

  @Post("createEstate")
  @ApiOkResponse({ type: GetEstateResponseDto })
  async create(@Req() request: any, @Headers() headers: AuthHeaderDto, @Body() dto: CreateEstateDto) {

    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    await this.createEstateService.execute(dto);

    return {
      message: 'ملک با موفقیت ساخته شد',
    };
  }

  @Get("getEstate")
  async getById(@Req() request: any, @Headers() headers: AuthHeaderDto, @Query("id") id: string) {

    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }
    
    const estate = await this.getEstate.execute(id);
    return {
      message:"اطلاعات با موفقیت ارسال شد",
      data: EstateMapper.toResponse(estate)
    };
  }

  @Get("getEstateList")
  async getList(@Req() request: any, @Headers() headers: AuthHeaderDto, @Query() query: GetEstatesQueryDto) {

    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const result = await this.getEstatesList.execute(query);

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const totalPages = Math.ceil(result.total / limit);

    return {
      message:"اطلاعات با موفقیت ارسال شد",
      data: result.data.map(EstateMapper.toResponse),
      meta: {
        page: page,
        limit: limit,
        total: result.total,
        totalPages: totalPages
      }
    };
  }

  @Patch("editEstate")
  async update(
    @Req() request: any,
    @Headers() headers: AuthHeaderDto,
    @Query("id") id: string,
    @Body() dto: UpdateEstateDto,
  ) {

    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const estate = await this.updateEstateService.execute(id, dto);
    return {
      message: "اطلاعات ملک با موفقیت به روز شد",
      data: EstateMapper.toResponse(estate)
    };
  }

  @Patch("editEstateStatus")
  async changeStatus(
    @Req() request: any,
    @Headers() headers: AuthHeaderDto,
    @Query("id") id: string,
    @Body() dto: ChangeEstateStatusDto,
  ) {

    if (!request.userData) {
      throw new UnauthorizedException('دسترسی نامعتبر است');
    }

    const estate = await this.changeStatusService.execute(id, dto.status);
    return {
      message: "وضعیت ملک با موفقیت تغییر کرد",
      data: EstateMapper.toResponse(estate)
    };
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateEstateService } from '../../application/services/create-estate.service';
import { CreateEstateDto } from '../../application/dtos/create-estate-dto';
import { EstateMapper } from '../mappers/estate.mapper';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetEstateListResponseDto } from '../../application/dtos/get-estate-list-response.dto';
import { GetEstatesQueryDto } from '../../application/dtos/get-estates-query.dto';
import { GetEstateService } from '../../application/services/get-estate.service';
import { GetEstatesListService } from '../../application/services/get-estate-list.service';

@Controller('estates')
export class EstateController {
  constructor(
    private readonly createEstateService: CreateEstateService,
    private readonly getEstate: GetEstateService,
    private readonly getEstatesList: GetEstatesListService,
  ) {}

  @Post("createEstate")
  @ApiOkResponse({ type: GetEstateListResponseDto })
  async create(@Body() dto: CreateEstateDto) {
    await this.createEstateService.execute(dto);

    return {
      message: 'ملک با موفقیت ساخته شد',
    };
  }

  @Get("getEstate")
  async getById(@Query("id") id: string) {
    const estate = await this.getEstate.execute(id);
    return EstateMapper.toResponse(estate);
  }

  @Get("getEstateList")
  async getList(@Query() query: GetEstatesQueryDto) {
    const result = await this.getEstatesList.execute(query);

    return {
      total: result.total,
      page: query.page,
      limit: query.limit,
      data: result.data.map(EstateMapper.toResponse),
    };
  }
}

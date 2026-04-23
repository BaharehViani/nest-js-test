// import {
//   Controller,
//   Post,
//   Get,
//   Body,
//   BadRequestException,
//   Patch,
//   Query,
// } from '@nestjs/common';
// import { UsersService } from './users.service';
// import * as UserDTOs from './users.dto';
// import { ApiOkResponse } from '@nestjs/swagger';

// @Controller('users')
// export class UsersController {
//   constructor(private readonly usersService: UsersService) {}

//   @Post()
//   @ApiOkResponse({type: UserDTOs.CreateUserResponseDto})
//   async createUserController(@Body() createUserDto: UserDTOs.CreateUserDto) {
//     const result = await this.usersService.createUserServie(createUserDto);

//     if (result.code == 1) {
//       return { message: result.message, id: result.userId };
//     }

//     throw new BadRequestException(result.message);
//   }

//   @Get()
//   @ApiOkResponse({ type: UserDTOs.UserListResponseDto })
//   async getUsersController() {
//     const result = await this.usersService.getUsersServie();

//     if (result.code == 1) {
//       return { message: result.message, data: result.data };
//     }

//     throw new BadRequestException(result.message);
//   }

//   @Patch()
//   @ApiOkResponse({type: UserDTOs.UpdateUserResponseDto})
//   async updateUserController(
//     @Query() query: UserDTOs.UpdateUserQueryDto,
//     @Body() updateUserDto: UserDTOs.UpdateUserDto,
//   ) {
//     const result = await this.usersService.updateUserServie(
//       query.id,
//       updateUserDto,
//     );

//     if (result.code == 1) {
//       return { message: result.message };
//     }

//     throw new BadRequestException(result.message);
//   }
// }

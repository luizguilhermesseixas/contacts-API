import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/response/response-user.dto';

// UserController handles user-related endpoints, we need to implement Roles for ADMINS
// and USERS, but for now, we will keep it simple.
// This controller will allow creating, retrieving, updating, and deleting users.
// We will also implement a simple authentication mechanism in the future.
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserResponseDto })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: [UserResponseDto] })
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserResponseDto })
  findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserResponseDto })
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.userService.remove(id);
  }
}

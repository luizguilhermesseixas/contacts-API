import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnauthorizedException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/request/create-user.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/response/response-user.dto';
import { AuthenticatedRequest, hasValidUser } from 'src/@types/request.types';
import { UserAuthorizationGuard } from 'src/common/guards/user-authorization.guard';
import { JwtAuthGuard } from 'src/common';
import {
  ApiCreatedResponse,
  ApiErrorResponses,
  ApiOkArrayResponse,
  ApiOkResponse,
} from 'src/common/decorators/api-response.decorator';

// TODO: Implement role-based access control for ADMINS and USERS. See issue #<issue-number>.

@ApiTags('User')
@ApiExtraModels(UserResponseDto)
@ApiErrorResponses()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse(UserResponseDto)
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOkArrayResponse(UserResponseDto)
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserAuthorizationGuard)
  @ApiBearerAuth()
  @ApiOkResponse(UserResponseDto)
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, UserAuthorizationGuard)
  @ApiBearerAuth()
  @ApiOkResponse(UserResponseDto)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserAuthorizationGuard)
  @ApiBearerAuth()
  @ApiOkResponse(UserResponseDto)
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<UserResponseDto> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }
    return this.userService.remove(id);
  }
}

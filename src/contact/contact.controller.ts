import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/request/create-contact.dto';
import { UpdateContactDto } from './dto/request/update-contact.dto';
import { ContactResponseDto } from './dto/response/response-contact.dto';
import { ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthenticatedRequest, hasValidUser } from 'src/@types/request.types';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOkArrayResponse,
  ApiErrorResponses,
} from 'src/common/decorators/api-response.decorator';

@ApiTags('Contact')
@ApiExtraModels(ContactResponseDto)
@ApiErrorResponses()
@UseGuards(JwtAuthGuard)
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiCreatedResponse(ContactResponseDto)
  create(
    @Body() createContactDto: CreateContactDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ContactResponseDto> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }

    return this.contactService.create(createContactDto, req.user.sub);
  }

  @Get()
  @ApiOkArrayResponse(ContactResponseDto)
  findAll(@Req() req: AuthenticatedRequest): Promise<ContactResponseDto[]> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }

    return this.contactService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOkResponse(ContactResponseDto)
  findOne(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ContactResponseDto> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }
    return this.contactService.findOne(id, req.user.sub);
  }

  @Patch(':id')
  @ApiOkResponse(ContactResponseDto)
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<ContactResponseDto> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }
    return this.contactService.update(id, updateContactDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOkResponse(ContactResponseDto)
  remove(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<ContactResponseDto> {
    if (!hasValidUser(req)) {
      throw new UnauthorizedException('Valid user authentication required');
    }
    return this.contactService.remove(id, req.user.sub);
  }
}

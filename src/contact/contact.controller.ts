import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/request/create-contact.dto';
import { UpdateContactDto } from './dto/request/update-contact.dto';
import { ContactResponseDto } from './dto/response/response-contact.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('contacts')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiCreatedResponse({ type: ContactResponseDto })
  create(
    @Body() createContactDto: CreateContactDto,
    @Req() req: { user: { id: string } },
  ): Promise<ContactResponseDto> {
    return this.contactService.create(createContactDto, req.user.id);
  }

  @Get()
  @ApiOkResponse({ type: [ContactResponseDto] })
  findAll(@Req() req: { user: { id: string } }): Promise<ContactResponseDto[]> {
    return this.contactService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOkResponse({ type: ContactResponseDto })
  findOne(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<ContactResponseDto> {
    return this.contactService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: ContactResponseDto })
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Req() req: { user: { id: string } },
  ): Promise<ContactResponseDto> {
    return this.contactService.update(id, updateContactDto, req.user.id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: ContactResponseDto })
  remove(
    @Param('id') id: string,
    @Req() req: { user: { id: string } },
  ): Promise<ContactResponseDto> {
    return this.contactService.remove(id, req.user.id);
  }
}

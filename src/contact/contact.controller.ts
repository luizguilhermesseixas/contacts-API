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

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  create(
    @Body() createContactDto: CreateContactDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.contactService.create(createContactDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: { user: { id: string } }) {
    return this.contactService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.contactService.findOne(id, req.user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.contactService.update(id, updateContactDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: { user: { id: string } }) {
    return this.contactService.remove(id, req.user.id);
  }
}

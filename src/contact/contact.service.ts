import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/request/create-contact.dto';
import { UpdateContactDto } from './dto/request/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  create(createContactDto: CreateContactDto, userId: string) {
    return this.prisma.contact.create({
      data: {
        ...createContactDto,
        userId,
      },
    });
  }

  findAll() {
    return `This action returns all contact`;
  }

  findOne(id: string) {
    return `This action returns a #${id} contact`;
  }

  update(id: string, updateContactDto: UpdateContactDto) {
    return `This action updates a #${id} contact`;
  }

  remove(id: string) {
    return `This action removes a #${id} contact`;
  }
}

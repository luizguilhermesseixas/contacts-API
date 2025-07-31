import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/request/create-contact.dto';
import { UpdateContactDto } from './dto/request/update-contact.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContactResponseDto } from './dto/response/response-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createContactDto: CreateContactDto,
    userId: string,
  ): Promise<ContactResponseDto> {
    const existingContact = await this.prisma.contact.findFirst({
      where: { email: createContactDto.email, userId },
    });

    if (existingContact) {
      throw new Error('Contact with this email already exists');
    }

    const contact = await this.prisma.contact.create({
      data: {
        ...createContactDto,
        userId,
      },
    });
    return new ContactResponseDto(contact);
  }

  async findAll(userId: string): Promise<ContactResponseDto[]> {
    const contacts = await this.prisma.contact.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return contacts.map((contact) => new ContactResponseDto(contact));
  }

  async findOne(id: string, userId: string): Promise<ContactResponseDto> {
    const contact = await this.prisma.contact.findFirst({
      where: { id, userId },
    });

    if (!contact) {
      throw new Error(`Contact with id ${id} not found`);
    }

    return new ContactResponseDto(contact);
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    userId: string,
  ): Promise<ContactResponseDto> {
    await this.findOne(id, userId);

    const contact = await this.prisma.contact.update({
      where: { id },
      data: updateContactDto,
    });

    return new ContactResponseDto(contact);
  }

  async remove(id: string, userId: string): Promise<ContactResponseDto> {
    await this.findOne(id, userId);

    const deleted = await this.prisma.contact.delete({
      where: { id },
    });

    return new ContactResponseDto(deleted);
  }
}

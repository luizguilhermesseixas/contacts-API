import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const existingContact = await this.prisma.contact.findFirst({
        where: {
          email: createContactDto.email,
          userId: userId,
        },
      });

      if (existingContact) {
        throw new ConflictException('Contact with this email already exists');
      }

      const contact = await this.prisma.contact.create({
        data: {
          ...createContactDto,
          userId,
        },
      });

      return new ContactResponseDto(contact);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create contact');
    }
  }

  async findAll(userId: string): Promise<ContactResponseDto[]> {
    try {
      const contacts = await this.prisma.contact.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      return contacts.map((contact) => new ContactResponseDto(contact));
    } catch (e) {
      throw new InternalServerErrorException(`Failed to fetch contacts ${e}`);
    }
  }

  async findOne(id: string, userId: string): Promise<ContactResponseDto> {
    try {
      const contact = await this.prisma.contact.findFirst({
        where: { id, userId },
      });

      if (!contact) {
        throw new NotFoundException('Contact not found');
      }

      return new ContactResponseDto(contact);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch contact');
    }
  }

  async update(
    id: string,
    updateContactDto: UpdateContactDto,
    userId: string,
  ): Promise<ContactResponseDto> {
    try {
      const existingContact = await this.prisma.contact.findFirst({
        where: { id, userId },
      });

      if (!existingContact) {
        throw new NotFoundException('Contact not found');
      }

      if (
        updateContactDto.email &&
        updateContactDto.email !== existingContact.email
      ) {
        const emailExists = await this.prisma.contact.findFirst({
          where: {
            email: updateContactDto.email,
            userId,
            NOT: { id },
          },
        });

        if (emailExists) {
          throw new ConflictException('Contact with this email already exists');
        }
      }

      const updatedContact = await this.prisma.contact.update({
        where: { id },
        data: updateContactDto,
      });

      return new ContactResponseDto(updatedContact);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update contact');
    }
  }

  async remove(id: string, userId: string): Promise<ContactResponseDto> {
    try {
      const existingContact = await this.prisma.contact.findFirst({
        where: { id, userId },
      });

      if (!existingContact) {
        throw new NotFoundException('Contact not found');
      }

      await this.prisma.contact.delete({
        where: { id },
      });

      return new ContactResponseDto(existingContact);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete contact');
    }
  }
}

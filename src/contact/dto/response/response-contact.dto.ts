import { ApiProperty } from '@nestjs/swagger';
import { Contact } from '@prisma/client';

export class ContactResponseDto {
  constructor(contact: Contact) {
    this.id = contact.id;
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.email = contact.email;
    this.phone = contact.phone ?? undefined;
    this.createdAt = contact.createdAt;
    this.updatedAt = contact.updatedAt;
  }

  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: '123-456-7890' })
  phone?: string;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

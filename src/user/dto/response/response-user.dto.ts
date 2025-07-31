import { ContactResponseDto } from '../../../contact/dto/response/response-contact.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/@types/user.types';

export class UserResponseDto {
  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.contacts = user.contacts
      ? user.contacts.map((contact) => new ContactResponseDto(contact))
      : [];
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  @ApiProperty({ example: '1' })
  id: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ type: [ContactResponseDto] })
  contacts: ContactResponseDto[];

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
  updatedAt: Date;
}

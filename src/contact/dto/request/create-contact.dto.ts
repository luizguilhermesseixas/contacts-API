/* eslint-disable @typescript-eslint/no-unsafe-call */

import { IsEmail, IsString } from 'class-validator';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}

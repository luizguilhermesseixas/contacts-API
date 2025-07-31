import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './request/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

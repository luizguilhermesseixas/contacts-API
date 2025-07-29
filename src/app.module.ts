import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [PrismaModule, ContactModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

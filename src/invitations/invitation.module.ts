import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { User } from 'src/utilisateur/entities/user.entity';
import { InvitationController } from './invitation.controller';
import { InvitationService } from './invitation.service';


@Module({
  imports: [TypeOrmModule.forFeature([Invitation, User])],
  controllers: [InvitationController],
  providers: [InvitationService],
})
export class InvitationModule {}


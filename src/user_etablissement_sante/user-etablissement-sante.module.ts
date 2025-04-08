import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEtablissementSanteService } from './user-etablissement-sante.service';
import { UserEtablissementSanteController } from './user-etablissement-sante.controller';
import { UserEtablissementSante } from './entities/user-etablissement-sante.entity';
import { CodeVerifOtp } from './entities/code-verif-otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEtablissementSante, CodeVerifOtp])],
  controllers: [UserEtablissementSanteController],
  providers: [UserEtablissementSanteService],
  exports: [TypeOrmModule], 
})
export class UserEtablissementSanteModule {}

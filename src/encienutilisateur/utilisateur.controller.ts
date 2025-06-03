// import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
// import { UtilisateurService } from './utilisateur.service';
// import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { UseGuards, Req } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { JwtRequest } from '../auth/jwt-request.interface';
// import { ChangeIdentifiantDto } from './dto/change-identifiant.dto';
// import { ConfirmIdentifiantDto } from './dto/confirm-identifiant.dto';

// @Controller('utilisateur')
// export class UtilisateurController {
//   constructor(private readonly service: UtilisateurService) {}

//   @Post('register')
//   register(@Body() dto: CreateUtilisateurDto) {
//     return this.service.register(dto);
//   }

//   @Post('generate-otp')
//   generateOtp(@Query('identifiant') identifiant: string) {
//     return this.service.generateOtp(identifiant);
//   }

//   @Post('verify-otp')
//   verifyOtp(@Body() dto: VerifyOtpDto) {
//     return this.service.verifyOtp(dto);
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Get('me')
//   getMe(@Req() req: JwtRequest) {
//     const userId = req.user.sub;
//     return this.service.getProfile(userId);
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Patch('me')
//   updateMyProfile(@Req() req: JwtRequest, @Body() dto: UpdateProfileDto) {
//     const userId = req.user.sub;
//     return this.service.updateProfile(userId, dto);
//   }


//   @Get('check/:identifiant')
//   async checkIdentifiant(@Param('identifiant') identifiant: string) {
//     const exists = await this.service.checkIdentifiant(identifiant);
//     return { exists };
//   }

//   @UseGuards(AuthGuard('jwt'))
//   @Delete('me')
//   async deleteMe(@Req() req: JwtRequest) {
//     const userId = req.user.sub;
//     return this.service.deleteUser(userId);
//   }


//   @Get('all')
//   findAllUsers() {
//     return this.service.getAllUsers();
//   }
  
//   @Get('noms')
//   getAllUsernames() {
//     return this.service.getAllPseudos();
//   }
  
//   @Get(':id')
//   getProfile(@Param('id') id: string) {
//     return this.service.getProfile(id);
//   }

//   @UseGuards(AuthGuard('jwt'))
// @Post('change-identifiant')
// changeIdentifiant(@Req() req: JwtRequest, @Body() dto: ChangeIdentifiantDto) {
//   const userId = req.user.sub;
//   return this.service.sendOtpForIdentifiantChange(userId, dto);
// }

// @UseGuards(AuthGuard('jwt'))
// @Post('confirm-identifiant')
// confirmIdentifiant(@Req() req: JwtRequest, @Body() dto: ConfirmIdentifiantDto) {
//   const userId = req.user.sub;
//   return this.service.confirmIdentifiantChange(userId, dto);
// }


// }

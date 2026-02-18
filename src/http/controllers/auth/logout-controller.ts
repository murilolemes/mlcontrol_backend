import { PrismaService } from '@/prisma/prisma.service';
import {
  Controller,
  Get,
  Res
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';


@Controller('/auth')
export class LogoutController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' })
    return { message: 'Logout realizado' }
  }
}

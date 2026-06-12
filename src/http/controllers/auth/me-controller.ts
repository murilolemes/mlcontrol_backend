import { PrismaService } from '@/prisma/prisma.service';
import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';


@Controller('/auth')
export class MeController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Não autenticado');
    }

    try {
      const decode = await this.jwt.verifyAsync(token);

      const user = await this.prisma.user.findUnique({
        where: { id: decode.sub },
        select: {
          id: true,
          name: true,
          email: true,
          companyId: true,
          avatar: true,
        }
      })

      return res.status(200).json({
        user
      });
    } catch (error) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

import { ZodValidationPipe } from '@/http/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Body,
  Controller,
  Post,
  Res,
  UnauthorizedException,
  UsePipes
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Response } from 'express';
import { z } from 'zod';

const authenticateBodySchema = z.object({
  login: z
    .string()
    .min(3, 'O login deve ter pelo menos 3 caracteres')
    .max(50, 'O login deve ter no máximo 50 caracteres')
    .nonempty('O login é obrigatório'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .max(100, 'A senha deve ter no máximo 100 caracteres')
    .nonempty('A senha é obrigatória'),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/auth')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) { }

  @Post('login')
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async login(
    @Body() body: AuthenticateBodySchema,
    @Res({ passthrough: true }) res: Response
  ) {
    const { login, password } = body

    const user = await this.prisma.user.findUnique({
      where: {
        login,
      }
    })

    if (!user) {
      throw new UnauthorizedException('As credenciais do usuário não correspondem')
    }

    const id = user.id;
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('As credenciais do usuário não correspondem')
    }

    const accessToken = await this.jwt.signAsync(
      { sub: id },
      { expiresIn: '7d' }
    )

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias
    })

    await this.prisma.user.update({
      where: { id },
      data: {
        lastAccess: new Date(),
      }
    })

    return {
      message: 'Autenticado com sucesso',
    }
  }
}

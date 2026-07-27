import { Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";

import { PrismaService } from "@/prisma/prisma.service";
import { JwtAuthGuard } from "@/shared/guards/jwt-auth.guard";

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class ShowAccountController {
  constructor(private prisma: PrismaService) { }

  @Get(':id')
  async show(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        login: true,
        active: true,
        lastAccess: true,
        createdAt: true,
        updatedAt: true
      },
    })

    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    return user
  }
}
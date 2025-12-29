import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { PrismaService } from "@/prisma/prisma.service";
import { Controller, Get, NotFoundException, Param, UseGuards } from "@nestjs/common";

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
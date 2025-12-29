import { JwtAuthGuard } from "@/auth/jwt-auth.guard";
import { PrismaService } from "@/prisma/prisma.service";
import { Controller, Get, Query, UseGuards } from "@nestjs/common";

@Controller('/accounts')
@UseGuards(JwtAuthGuard)
export class ListAccountController {
  constructor(private prisma: PrismaService) { }

  @Get()
  async list(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search?: string,
    @Query('orderBy') orderBy: string = 'createdAt',
    @Query('order') order: 'asc' | 'desc' = 'asc'
  ) {
    const pageNumber = Number(page)
    const pageSize = Number(limit)

    const users = await this.prisma.user.findMany({
      where: search
        ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { login: { contains: search, mode: 'insensitive' } }
          ]
        }
        : undefined,

      skip: (pageNumber - 1) * pageSize,
      take: pageSize,

      orderBy: {
        [orderBy]: order
      },

      select: {
        id: true,
        name: true,
        email: true,
        login: true,
        active: true,
        lastAccess: true,
        createdAt: true,
        updatedAt: true
      }
    })

    const total = await this.prisma.user.count()

    return {
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data: users
    }
  }
}
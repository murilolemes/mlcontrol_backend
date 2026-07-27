import { PrismaService } from "@/prisma/prisma.service";
import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) { }

  async findById(companyId: string) {
    return this.prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });
  }

  async ensureExists(companyId: string) {
    const company = await this.findById(companyId);

    if (!company) {
      throw new ConflictException('Empresa não encontrada');
    }

    return company;
  }
}
import { PrismaService } from "@/prisma/prisma.service";
import { ConflictException, Injectable } from "@nestjs/common";

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) { }

  async findById(clientId: string, companyId: string) {
    return this.prisma.client.findUnique({
      where: {
        id: clientId,
        companyId,
      },
    });
  }

  async clientExists(clientId: string, companyId: string) {
    const client = await this.findById(clientId, companyId)

    if (!client) {
      throw new ConflictException('Cliente não encontrado')
    }
  }
}

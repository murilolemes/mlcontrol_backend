import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ReceitawsResponseDto } from '../dto/receitaws.dto';

@Injectable()
export class ReceitawsService {
  constructor(private readonly http: HttpService) { }

  async consultar(cnpj: string): Promise<ReceitawsResponseDto> {
    cnpj = cnpj.replace(/\D/g, '');

    const { data } = await firstValueFrom(
      this.http.get(
        `https://receitaws.com.br/v1/cnpj/${cnpj}`,
      ),
    );

    if (data.status === 'ERROR') {
      throw new BadRequestException(data.message);
    }

    return {
      abertura: data.abertura,
      situacao: data.situacao,
      tipo: data.tipo,
      nome: data.nome,
      fantasia: data.fantasia,
      logradouro: data.logradouro,
      numero: data.numero,
      municipio: data.municipio,
      bairro: data.bairro,
      uf: data.uf,
      cep: data.cep,
      email: data.email,
      telefone: data.telefone,
      cnpj: data.cnpj,
      complemento: data.complemento,
    }
  }
}
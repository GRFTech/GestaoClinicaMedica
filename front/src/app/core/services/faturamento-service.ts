import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface FaturamentoDTO {
  data?: string;
  inicio?: string;
  fim?: string;
  codigo_medico?: number;
  codigo_especialidade?: number;
  faturamento: number;
}

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService {
  private http = inject(HttpClient);
  private backURL = environment.apiURL;

  /**
   * Faturamento por dia
   */
  async faturamentoPorDia(data: string): Promise<FaturamentoDTO | null> {

    console.log(data)

    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: FaturamentoDTO }>(
          `${this.backURL}/faturamento/dia?data=${data}`
        )
      );
      return response.status === 'SUCESSO' ? response.dados : null;
    } catch (err) {
      console.error('Erro ao buscar faturamento por dia:', err);
      return null;
    }
  }

  /**
   * Faturamento por período
   */
  async faturamentoPorPeriodo(inicio: string, fim: string): Promise<FaturamentoDTO | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: FaturamentoDTO }>(
          `${this.backURL}/faturamento/periodo?inicio=${inicio}&fim=${fim}`
        )
      );
      return response.status === 'SUCESSO' ? response.dados : null;
    } catch (err) {
      console.error('Erro ao buscar faturamento por período:', err);
      return null;
    }
  }

  /**
   * Faturamento por médico
   */
  async faturamentoPorMedico(codigo: number): Promise<FaturamentoDTO | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: FaturamentoDTO }>(
          `${this.backURL}/faturamento/medico/${codigo}`
        )
      );
      return response.status === 'SUCESSO' ? response.dados : null;
    } catch (err) {
      console.error('Erro ao buscar faturamento por médico:', err);
      return null;
    }
  }

  /**
   * Faturamento por especialidade
   */
  async faturamentoPorEspecialidade(codigo: number): Promise<FaturamentoDTO | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: FaturamentoDTO }>(
          `${this.backURL}/faturamento/especialidade/${codigo}`
        )
      );
      return response.status === 'SUCESSO' ? response.dados : null;
    } catch (err) {
      console.error('Erro ao buscar faturamento por especialidade:', err);
      return null;
    }
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { DatePickerModule } from 'primeng/datepicker';

import { FaturamentoDTO, FaturamentoService } from '../../../core/services/faturamento-service';
import { InputText } from 'primeng/inputtext';
import {Header} from '../../../core/components/header/header';
import {InputNumber} from 'primeng/inputnumber';

@Component({
  selector: 'app-faturamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    Header,
    MessageModule,
    InputText,
    Header,
    DatePickerModule,
    InputNumber
  ],
  templateUrl: './faturamento.html',
  styleUrls: ['./faturamento.scss'],
})
export class Faturamento {
  data: string | null = null;
  inicio: string | null = null;
  fim: string | null = null;
  codigoMedico: number | null = null;
  codigoEspecialidade: number | null = null;

  faturamento: FaturamentoDTO | null = null;
  erro: string = '';

  constructor(private faturamentoService: FaturamentoService) {}

  async buscarPorDia() {
    if (!this.data) {
      this.erro = 'Selecione uma data.';
      return;
    }
    this.erro = '';
    const dataFormatada = this.formatarDataParaDDMMYYYY(this.data);
    this.faturamento = await this.faturamentoService.faturamentoPorDia(dataFormatada);
    if (!this.faturamento) this.erro = 'Erro ao buscar faturamento por dia.';
  }

  async buscarPorPeriodo() {
    if (!this.inicio || !this.fim) {
      this.erro = 'Selecione início e fim do período.';
      return;
    }
    this.erro = '';
    const inicioFormatado = this.formatarDataParaDDMMYYYY(this.inicio);
    const fimFormatado = this.formatarDataParaDDMMYYYY(this.fim);
    this.faturamento = await this.faturamentoService.faturamentoPorPeriodo(inicioFormatado, fimFormatado);
    if (!this.faturamento) this.erro = 'Erro ao buscar faturamento por período.';
  }

  async buscarPorMedico() {
    if (!this.codigoMedico) {
      this.erro = 'Informe o código do médico.';
      return;
    }
    this.erro = '';
    this.faturamento = await this.faturamentoService.faturamentoPorMedico(this.codigoMedico);
    if (!this.faturamento) this.erro = 'Erro ao buscar faturamento por médico.';
  }

  async buscarPorEspecialidade() {
    if (!this.codigoEspecialidade) {
      this.erro = 'Informe o código da especialidade.';
      return;
    }
    this.erro = '';
    this.faturamento = await this.faturamentoService.faturamentoPorEspecialidade(this.codigoEspecialidade);
    if (!this.faturamento) this.erro = 'Erro ao buscar faturamento por especialidade.';
  }


  // Converte "2025-10-07" ou Date para "DD/MM/YYYY"
  private formatarDataParaDDMMYYYY(data: string | Date): string {
    let d: Date;
    if (typeof data === 'string') {
      d = new Date(data);
    } else {
      d = data;
    }
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0'); // mês começa do 0
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

}

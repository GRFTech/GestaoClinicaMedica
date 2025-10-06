import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

import { FaturamentoDTO, FaturamentoService } from '../../../core/services/faturamento-service';
import { InputText } from 'primeng/inputtext';
import {Header} from '../../../core/components/header/header';

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
    Header
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
    this.faturamento = await this.faturamentoService.faturamentoPorDia(this.data);
    if (!this.faturamento) this.erro = 'Erro ao buscar faturamento por dia.';
  }

  async buscarPorPeriodo() {
    if (!this.inicio || !this.fim) {
      this.erro = 'Selecione início e fim do período.';
      return;
    }
    this.erro = '';
    this.faturamento = await this.faturamentoService.faturamentoPorPeriodo(this.inicio, this.fim);
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
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../../../core/components/header/header';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';

import Medico from '../../../../core/model/medico/Medico';
import { CidadeUI } from '../../../../core/model/cidade/CidadeUI';
import Especialidade from '../../../../core/model/especialidade/Especialidade';

import { MedicoService } from '../../../../core/services/medico-service';
import { CidadeService } from '../../../../core/services/cidade-service';
import { EspecialidadeService } from '../../../../core/services/especialidade-service';

@Component({
  selector: 'app-consulta-medico',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Header,
    ButtonModule,
    InputTextModule,
    CardModule,
    DividerModule,
    MessageModule,
  ],
  templateUrl: './consulta-medico.html',
  styleUrl: './consulta-medico.scss',
})
export class ConsultaMedico {
  medicoId: string = '';
  medico: Medico | null = null;
  cidade: CidadeUI | null = null;
  especialidade: Especialidade | null = null;
  erro: string = '';
  carregando: boolean = false;

  constructor(
    private medicoService: MedicoService,
    private cidadeService: CidadeService,
    private especialidadeService: EspecialidadeService
  ) {}

  async buscarMedico() {
    this.erro = '';
    this.medico = null;
    this.cidade = null;
    this.especialidade = null;
    this.carregando = true;

    if (!this.medicoId.trim()) {
      this.erro = 'Por favor, insira um código de médico válido.';
      this.carregando = false;
      return;
    }

    const codigo = Number(this.medicoId);

    // Busca médico
    const medico = await this.medicoService.getMedicoById(codigo);
    this.carregando = false;

    if (!medico) {
      this.erro = 'Médico não encontrado.';
      return;
    }

    this.medico = medico;

    // Busca cidade
    const cidade = await this.cidadeService.getCidadeById(medico.codigo_cidade);
    if (!cidade) {
      this.erro = 'Cidade do médico não encontrada.';
      return;
    }
    this.cidade = cidade;

    // Busca especialidade
    const especialidade = await this.especialidadeService.getEspecialidadeById(
      medico.codigo_especialidade
    );
    if (!especialidade) {
      this.erro = 'Especialidade do médico não encontrada.';
      return;
    }
    this.especialidade = especialidade;
  }
}

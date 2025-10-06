import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Header } from '../../../../core/components/header/header';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { PacienteService } from '../../../../core/services/paciente-service';
import Paciente from '../../../../core/model/paciente/Paciente';

@Component({
  selector: 'app-imc',
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
  templateUrl: './imc.html',
  styleUrl: './imc.scss',
})
export class IMC {
  pacienteId: string = '';
  paciente: Paciente | null = null;
  imc: number | null = null;
  diagnostico: string = '';
  erro: string = '';
  carregando: boolean = false;

  constructor(private pacienteService: PacienteService) {}

  async buscarPaciente() {
    this.erro = '';
    this.paciente = null;
    this.imc = null;
    this.diagnostico = '';
    this.carregando = true;

    if (!this.pacienteId.trim()) {
      this.erro = 'Por favor, insira um código de paciente válido.';
      this.carregando = false;
      return;
    }

    const codigo = Number(this.pacienteId);
    const paciente = await this.pacienteService.getPacienteById(codigo);
    this.carregando = false;

    if (!paciente) {
      this.erro = 'Paciente não encontrado.';
      return;
    }

    this.paciente = paciente;

    // usa o IMC do backend se existir, senão calcula
    this.imc = this.calcularIMC(paciente);
    this.diagnostico = this.definirDiagnostico(this.imc);
  }

  private calcularIMC(paciente: Paciente): number | null {
    let { peso, altura } = paciente;

    if (!peso || !altura || altura <= 0) {
      this.erro = 'Dados de peso ou altura inválidos.';
      return null;
    }

    // Se altura > 3, assumimos que está em cm
    if (altura > 3) {
      altura = altura / 100;
    }

    return peso / (altura * altura);
  }


  private definirDiagnostico(imc: number | null): string {
    if (imc === null) return '';
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  }
}

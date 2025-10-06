import { Injectable, signal, computed, inject } from '@angular/core';
import Consulta from '../model/consulta/Consulta';
import ConsultaUI from '../model/consulta/ConsultaUI';
import { environment } from '../../../environments/environment.development';
import { PacienteService } from './paciente-service';
import { MedicoService } from './medico-service';
import { ExameService } from './exame-service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  // Injeções
  pacienteService = inject(PacienteService);
  medicoService = inject(MedicoService);
  exameService = inject(ExameService);
  private http = inject(HttpClient);

  // Propriedades
  backURL = environment.apiURL;
  private consultas = signal<Consulta[]>([]);

  consultasDto = this.consultas.asReadonly();

  // UI derivada automaticamente
  consultasUI = computed<ConsultaUI[]>(() =>
    this.consultas().map(c => this.DTOtoUI(c))
  );

  constructor() {
    this.initializeData();
  }

  /** Inicializa tudo */
  private async initializeData(): Promise<void> {
    try {
      await this.pacienteService.getPacientes();
      await this.medicoService.getMedicos();
      await this.exameService.getExames();
      await this.getConsultas();
    } catch (err) {
      console.error('Erro ao inicializar ConsultaService:', err);
    }
  }

  /** Busca as consultas do backend */
  async getConsultas(): Promise<Consulta[]> {
    if (this.consultas().length) return this.consultas();

    try {
      const response = await firstValueFrom(
        this.http.get<{ dados: any[]; status: string }>(`${this.backURL}/consultas`)
      );

      if (response.status === 'SUCESSO' && Array.isArray(response.dados)) {
        const consultas = response.dados.map(obj => Consulta.fromJSON(obj));
        this.consultas.set(consultas);
        console.log('Consultas carregadas:', consultas);
        return consultas;
      } else {
        console.warn('Resposta inesperada do servidor:', response);
        return [];
      }

    } catch (err) {
      console.error('Erro ao buscar consultas:', err);
      return [];
    }
  }

  /** Converte UI → DTO */
  private UItoDto(ui: ConsultaUI): Consulta {
    const paciente = this.pacienteService.pacientesDto().find(p => p.nome === ui.paciente);
    const medico = this.medicoService.medicosDto().find(m => m.nome === ui.medico);
    const exame = this.exameService.examesDto().find(e => e.descricao === ui.exame);

    return new Consulta(
      ui.codigo_consulta,
      paciente?.codigo_paciente ?? 0,
      medico?.id ?? 0,
      exame?.codigo_exame ?? 0,
      ui.data.toLocaleDateString('pt-BR'),
      ui.data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    );
  }

  /** Converte DTO → UI */
  private DTOtoUI(dto: Consulta): ConsultaUI {
    const paciente = this.pacienteService.pacientesDto().find(p => p.codigo_paciente === dto.codigo_paciente);
    const medico = this.medicoService.medicosDto().find(m => m.id === dto.codigo_medico);
    const exame = this.exameService.examesDto().find(e => e.codigo_exame === dto.codigo_exame);

    const data = this.parseDate(dto.data, dto.hora);

    return new ConsultaUI(
      dto.codigo_consulta,
      data,
      paciente?.nome ?? '',
      medico?.nome ?? '',
      exame?.descricao ?? ''
    );
  }

  /** Converte "01/01/2001" + "00:00" → Date */
  private parseDate(dataStr: string, horaStr: string): Date {
    try {
      const [dia, mes, ano] = dataStr.split('/').map(Number);
      const [hora, minuto] = horaStr.split(':').map(Number);
      return new Date(ano, mes - 1, dia, hora, minuto);
    } catch {
      return new Date();
    }
  }

  /** Cria nova consulta */
  createConsulta(ui: ConsultaUI) {
    const dto = this.UItoDto(ui);
    this.http.post<{ status: string; mensagem: string }>(
      `${environment.apiURL}/consultas`,
      dto.toJSON()
    ).subscribe({
      next: (res) => {
        if (res.status === 'SUCESSO') {
          this.getConsultas(); // recarrega a lista
        }
      },
      error: (err) => console.error('Erro ao criar consulta:', err)
    });
  }

  /** Atualiza consulta existente */
  updateConsulta(ui: ConsultaUI) {
    const dto = this.UItoDto(ui);
    this.http.put<{ status: string; mensagem: string }>(
      `${environment.apiURL}/consultas/${ui.codigo_consulta}`,
      dto.toJSON()
    ).subscribe({
      next: (res) => {
        if (res.status === 'SUCESSO') this.getConsultas();
      },
      error: (err) => console.error('Erro ao atualizar consulta:', err)
    });
  }

  /** Exclui consulta */
  deleteConsulta(ui: ConsultaUI) {
    this.http.delete<{ status: string; mensagem: string }>(
      `${environment.apiURL}/consultas/${ui.codigo_consulta}`
    ).subscribe({
      next: (res) => {
        if (res.status === 'SUCESSO') {
          this.consultas.update(cs => cs.filter(c => c.codigo_consulta !== ui.codigo_consulta));
        }
      },
      error: (err) => console.error('Erro ao excluir consulta:', err)
    });
  }

  /** Exclui várias */
  deleteConsultas(uis: ConsultaUI[]) {
    uis.forEach(ui => this.deleteConsulta(ui));
  }
}

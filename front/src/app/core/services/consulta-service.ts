import {Injectable, Signal, signal, computed, inject} from '@angular/core';
import Consulta from '../model/consulta/Consulta';
import ConsultaUI from '../model/consulta/ConsultaUI';
import { environment } from '../../../environments/environment.development';
import {PacienteService} from './paciente-service';
import {MedicoService} from './medico-service';
import {ExameService} from './exame-service';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  pacienteService = inject(PacienteService);
  medicoService = inject(MedicoService);
  exameService = inject(ExameService);

  constructor() {
    this.getConsultas()
  }

  backURL = environment.apiURL;
  private consultas = signal<Consulta[]>([]);

  // Exposição DTO (caso precise em outro lugar)
  consultasDto = this.consultas.asReadonly();

  // Exposição já como UI
  consultasUI = computed<ConsultaUI[]>(() =>
    this.consultas().map(c => this.DTOtoUI(c))
  );

  /**
   * Retorna todas as consultas mock.
   */
  getConsultas() {
    const c = [
      new Consulta(1, new Date(), 10, 1, 6),
      new Consulta(2, new Date('2025-09-01T10:00:00'), 12, 1, 3),
      new Consulta(3, new Date('2025-09-02T11:30:00'), 15, 2, 29),
      new Consulta(4, new Date('2025-09-03T09:00:00'), 18, 5, 2),
      new Consulta(5, new Date('2025-09-04T14:15:00'), 20, 8, 6),
      new Consulta(6, new Date('2025-09-05T08:45:00'), 22, 14, 8),
      new Consulta(7, new Date('2025-09-06T16:00:00'), 25, 14, 22),
      new Consulta(8, new Date('2025-09-07T13:00:00'), 28, 25, 7),
      new Consulta(9, new Date('2025-09-08T10:30:00'), 30, 22, 15),
      new Consulta(10, new Date('2025-09-09T11:00:00'), 30, 18, 18),
    ];

    this.consultas.set(c);
  }

  /**
   * Mapeia um objeto de UI para um de banco
   * @param ui é um objeto de UI
   * @returns Consulta
   */
  private UItoDto(ui: ConsultaUI): Consulta {
    const paciente = this.pacienteService.pacientesDto().find(p => p.nome === ui.paciente);
    const medico = this.medicoService.medicosDto().find(m => m.nome === ui.medico);
    const exame = this.exameService.examesDto().find(e => e.descricao === ui.exame);
    return new Consulta(ui.id, ui.data, paciente!.id, medico!.id, exame!.id);
  }

  /**
   * Mapeia um objeto de banco para um de UI
   * @param dto é um objeto de banco
   * @returns ConsultaUI
   */
  private DTOtoUI(dto: Consulta): ConsultaUI {
    const paciente = this.pacienteService.pacientesDto().find(p => p.id === dto.pacienteId);
    const medico = this.medicoService.medicosDto().find(m => m.id === dto.medicoId);
    const exame = this.exameService.examesDto().find(e => e.id === dto.exameId);
    return new ConsultaUI(dto.id, dto.data, paciente!.nome, medico!.nome, exame!.descricao);
  }

  /**
   * Salva uma consulta no banco de dados.
   * @param ui é um objeto de UI
   */
  createConsulta(ui: ConsultaUI) {
    this.consultas.update(cs => [...cs, this.UItoDto(ui)]);
  }

  /**
   * Atualiza uma consulta no banco de dados.
   * @param ui é um objeto de UI
   */
  updateConsulta(ui: ConsultaUI) {
    this.consultas.update(cs =>
      cs.map(c => (c.id === ui.id ? this.UItoDto(ui) : c))
    );
  }

  /**
   * Deleta uma consulta no banco de dados.
   * @param ui é um objeto de UI
   */
  deleteConsulta(ui: ConsultaUI) {
    this.consultas.update(cs => cs.filter(c => c.id !== ui.id));
  }

  /**
   * Deleta várias consultas selecionadas do banco de dados.
   * @param uis é um array de objetos de UI
   */
  deleteConsultas(uis: ConsultaUI[]) {
    const ids = uis.map(u => u.id);
    this.consultas.update(cs => cs.filter(c => !ids.includes(c.id)));
  }
}

import {Injectable, signal, computed, inject} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Diaria from '../model/diaria/Diaria';
import DiariaUI from '../model/diaria/DiariaUI';
import {EspecialidadeService} from './especialidade-service';

@Injectable({
  providedIn: 'root'
})
export class DiariaService {

  private especialidadeService = inject(EspecialidadeService);

  backURL = environment.apiURL;
  private diarias = signal<Diaria[]>([]);

  // Exposição como readonly
  diariasDto = this.diarias.asReadonly();

  // Exposição já como UI (mapeado automaticamente)
  diariasUI = computed<DiariaUI[]>(() =>
    this.diarias().map(d => this.DTOtoUI(d))
  );

  constructor() {
    this.getDiarias();
  }

  /**
   * Normaliza uma data para o início do dia (00:00:00).
   * Isso garante que a comparação de duas datas do mesmo dia funcione.
   * @param date A data a ser normalizada.
   * @returns Um novo objeto Date com o horário zerado.
   */
  private normalizeDate(date: Date): Date {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  }

  /**
   * Mock inicial de diárias.
   */
  getDiarias() {
    const d = [
      new Diaria(this.normalizeDate(new Date()), 10, 1),
      new Diaria(this.normalizeDate(new Date()), 8, 2),
      new Diaria(this.normalizeDate(new Date()), 12, 3),
      new Diaria(this.normalizeDate(new Date(Date.now() - 86400000)), 9, 1),
      new Diaria(this.normalizeDate(new Date(Date.now() - 86400000)), 7, 2),
      new Diaria(this.normalizeDate(new Date(Date.now() - 86400000)), 15, 4),
      new Diaria(this.normalizeDate(new Date(Date.now() - 172800000)), 11, 1),
      new Diaria(this.normalizeDate(new Date(Date.now() - 172800000)), 14, 5),
      new Diaria(this.normalizeDate(new Date(Date.now() - 172800000)), 16, 3),
      new Diaria(this.normalizeDate(new Date(Date.now() - 259200000)), 20, 2),
      new Diaria(this.normalizeDate(new Date(Date.now() - 259200000)), 13, 4),
      new Diaria(this.normalizeDate(new Date(Date.now() - 259200000)), 9, 1),
      new Diaria(this.normalizeDate(new Date(Date.now() - 345600000)), 8, 5),
      new Diaria(this.normalizeDate(new Date(Date.now() - 345600000)), 14, 3),
      new Diaria(this.normalizeDate(new Date(Date.now() - 345600000)), 10, 2),
      new Diaria(this.normalizeDate(new Date(Date.now() - 432000000)), 7, 4),
      new Diaria(this.normalizeDate(new Date(Date.now() - 432000000)), 16, 5),
      new Diaria(this.normalizeDate(new Date(Date.now() - 432000000)), 18, 1),
      new Diaria(this.normalizeDate(new Date(Date.now() - 518400000)), 12, 2),
      new Diaria(this.normalizeDate(new Date(Date.now() - 518400000)), 14, 3),
      new Diaria(this.normalizeDate(new Date(Date.now() - 518400000)), 13, 4),
      new Diaria(this.normalizeDate(new Date(Date.now() - 604800000)), 19, 5),
      new Diaria(this.normalizeDate(new Date(Date.now() - 604800000)), 8, 2),
      new Diaria(this.normalizeDate(new Date(Date.now() - 604800000)), 11, 1),
      new Diaria(this.normalizeDate(new Date(Date.now() - 691200000)), 15, 3),
      new Diaria(this.normalizeDate(new Date(Date.now() - 691200000)), 13, 4),
      new Diaria(this.normalizeDate(new Date(Date.now() - 691200000)), 7, 5),
      new Diaria(this.normalizeDate(new Date(Date.now() - 777600000)), 12, 2),
      new Diaria(this.normalizeDate(new Date(Date.now() - 777600000)), 17, 1),
      new Diaria(this.normalizeDate(new Date(Date.now() - 777600000)), 14, 3)
    ];

    this.diarias.set(d);
  }

  /**
   * Mapeia um objeto de UI para um de DTO
   * @param diariaUI é um objeto de UI
   * @returns Diaria
   */
  private UItoDto(diariaUI: DiariaUI): Diaria {
    return new Diaria(
      diariaUI.codigoDia,
      diariaUI.quantidadeConsultas,
      this.especialidadeService.especialidadesDto().find(e => e.descricao === diariaUI.especialidade)!.id
    );
  }

  /**
   * Mapeia um objeto de DTO para um de UI
   * @param diaria é um objeto de DTO
   * @returns DiariaUI
   */
  private DTOtoUI(diaria: Diaria): DiariaUI {
    return new DiariaUI(
      diaria.codigoDia,
      diaria.formatarDataAAAAMMDD(diaria.codigoDia),
      diaria.quantidadeConsultas,
      this.especialidadeService.especialidadesDto().find(e => e.id === diaria.especialidadeId)!.descricao
    );
  }

  /**
   * Salva uma diária no banco de dados.
   * Se já existir uma com a mesma data e especialidade, SOMA as consultas.
   * @param ui é um objeto de UI
   */
  createDiaria(ui: DiariaUI) {
    const dto = this.UItoDto(ui);

    const currentDiarias = this.diarias();
    const index = currentDiarias.findIndex(d =>
      this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(dto.codigoDia).getTime() &&
      d.especialidadeId === dto.especialidadeId
    );

    if (index !== -1) {
      const updated = [...currentDiarias];
      updated[index].quantidadeConsultas += dto.quantidadeConsultas; // Aqui, o valor é SOMADO
      this.diarias.set(updated);
    } else {
      this.diarias.set([...currentDiarias, dto]);
    }
  }

  /**
   * Atualiza uma diária no banco de dados.
   * Se já existir uma com a mesma data e especialidade, SUBSTITUI as consultas.
   * Caso contrário, adiciona novo registro.
   * @param ui é um objeto de UI
   */
  updateDiaria(ui: DiariaUI) {
    const dto = this.UItoDto(ui);

    const currentDiarias = this.diarias();
    const index = currentDiarias.findIndex(d =>
      this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(dto.codigoDia).getTime() &&
      d.especialidadeId === dto.especialidadeId
    );

    if (index !== -1) {
      const updated = [...currentDiarias];
      updated[index].quantidadeConsultas = dto.quantidadeConsultas; // Aqui, o valor é SUBSTITUÍDO
      this.diarias.set(updated);
    } else {
      this.diarias.set([...currentDiarias, dto]);
    }
  }
  /**
   * Deleta uma diária do banco de dados.
   * @param ui é um objeto de UI
   */
  deleteDiaria(ui: DiariaUI) {
    this.diarias.update(diarias =>
      diarias.filter(d => this.normalizeDate(d.codigoDia).getTime() !== this.normalizeDate(ui.codigoDia).getTime())
    );
  }

  /**
   * Deleta várias diárias selecionadas do banco de dados.
   * @param uis é um array de objetos de UI
   */
  deleteDiarias(uis: DiariaUI[]) {
    const dias = uis.map(u => this.normalizeDate(u.codigoDia).getTime());
    this.diarias.update(diarias =>
      diarias.filter(d => !dias.includes(this.normalizeDate(d.codigoDia).getTime()))
    );
  }
}

import {Injectable, signal, computed, inject} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Diaria from '../model/diaria/Diaria';
import DiariaUI from '../model/diaria/DiariaUI';
import {EspecialidadeService} from './especialidade-service';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class DiariaService {

  // Injeções
  private especialidadeService = inject(EspecialidadeService);
  private http = inject(HttpClient); // 2. Injetar HttpClient

  // Propriedades
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
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  getDiarias() {
    this.http.get<Diaria[]>(`${environment.apiURL}/diarias`) // Chamada HTTP GET
      .subscribe({
        next: data => {
          // No DTO, a data pode vir como string. Se for o caso, converta para Date.
          // Ex: data.forEach(d => d.codigoDia = new Date(d.codigoDia));
          this.diarias.set(data)
        },
        error: (err) => console.error(err)
      });
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
   * Assume que o backend fará a lógica de SOMAR as consultas se já existir.
   * @param ui é um objeto de UI
   */
  createDiaria(ui: DiariaUI) {
    const dto = this.UItoDto(ui);

    // POST: Assumimos que a rota POST trata a lógica de agregação (somar) no backend.
    this.http.post<Diaria>(`${environment.apiURL}/diarias`, dto).subscribe({
      next: data => {
        // O backend retorna a diária atualizada (que pode ser a somada ou a nova).
        const currentDiarias = this.diarias();
        const index = currentDiarias.findIndex(d =>
          this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(data.codigoDia).getTime() &&
          d.especialidadeId === data.especialidadeId
        );

        if (index !== -1) {
          // Atualiza se existia (lógica de soma do backend)
          this.diarias.update(diarias =>
            diarias.map((d, i) => (i === index ? data : d))
          );
        } else {
          // Adiciona se for novo
          this.diarias.update(diarias => [...diarias, data]);
        }
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza uma diária no banco de dados.
   * Assume que o backend fará a lógica de SUBSTITUIR as consultas se já existir.
   * @param ui é um objeto de UI
   */
  updateDiaria(ui: DiariaUI) {
    const dto = this.UItoDto(ui);

    // PUT: Assumimos que a rota PUT trata a lógica de substituição no backend.
    this.http.put<Diaria>(`${environment.apiURL}/diarias`, dto).subscribe({
      next: data => {
        // O backend retorna a diária atualizada (que pode ser a substituída ou a nova).
        const currentDiarias = this.diarias();
        const index = currentDiarias.findIndex(d =>
          this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(data.codigoDia).getTime() &&
          d.especialidadeId === data.especialidadeId
        );

        if (index !== -1) {
          // Atualiza se existia (lógica de substituição do backend)
          this.diarias.update(diarias =>
            diarias.map((d, i) => (i === index ? data : d))
          );
        } else {
          // Adiciona se for novo
          this.diarias.update(diarias => [...diarias, data]);
        }
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta uma diária do banco de dados.
   * @param ui é um objeto de UI
   */
  deleteDiaria(ui: DiariaUI) {
    const dataFormatada = ui.codigoDia.toISOString().split('T')[0];
    const url = `${environment.apiURL}/diarias/${dataFormatada}/${this.especialidadeService.especialidadesDto().find(e => e.descricao === ui.especialidade)!.id}`;

    // DELETE: Assume-se uma rota com identificadores compostos (Data e EspecialidadeId)
    this.http.delete(url).subscribe({
      next: () => {
        this.diarias.update(diarias =>
          diarias.filter(d =>
            !(this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(ui.codigoDia).getTime() &&
              this.especialidadeService.especialidadesDto().find(e => e.id === d.especialidadeId)!.descricao === ui.especialidade)
          )
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta várias diárias selecionadas do banco de dados.
   * Nota: A lógica original deletava APENAS pelo dia, o que apagava TODAS as especialidades daquele dia.
   * Mantendo a lógica de apagar TODAS as diárias para o dia selecionado (pelo código do dia).
   * @param uis é um array de objetos de UI
   */
  deleteDiarias(uis: DiariaUI[]) {
    const dias = uis.map(u => this.normalizeDate(u.codigoDia).getTime());

    // Não existe um endpoint de "delete em massa", então replicamos o loop do CidadeService.
    // Usaremos a lógica de DELETE que apaga todos os registros de um DIA, se o backend suportar.
    for (const ui of uis) {
      const dataFormatada = ui.codigoDia.toISOString().split('T')[0];
      // Rota de DELETE por Dia (assumindo que apagar por dia/especialidade foi o pretendido)
      const especialidadeId = this.especialidadeService.especialidadesDto().find(e => e.descricao === ui.especialidade)!.id;
      const url = `${environment.apiURL}/diarias/${dataFormatada}/${especialidadeId}`;


      this.http.delete(url).subscribe({
        next: () => {
          this.diarias.update(diarias =>
            diarias.filter(d =>
              !(this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(ui.codigoDia).getTime() &&
                this.especialidadeService.especialidadesDto().find(e => e.id === d.especialidadeId)!.descricao === ui.especialidade)
            )
          );
        },
        error: (err) => console.error(err)
      });
    }
  }
}

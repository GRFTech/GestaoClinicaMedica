import {Injectable, signal, computed, inject} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Diaria from '../model/diaria/Diaria';
import DiariaUI from '../model/diaria/DiariaUI';
import {EspecialidadeService} from './especialidade-service';
import { HttpClient } from '@angular/common/http';
import Consulta from '../model/consulta/Consulta';
import {firstValueFrom} from 'rxjs'; // 1. Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class DiariaService {

  // Injeções
  private especialidadeService = inject(EspecialidadeService);
  private http = inject(HttpClient);

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
    this.initializeData();
  }

  /**
   * Método responsável por carregar os dados de maneira assíncrona e garantir que tudo apareça na UI
   */
  private async initializeData(): Promise<void> {
    try {
      await this.especialidadeService.getEspecialidades();
      await this.getDiarias();
    } catch (err) {
      console.error('Erro ao inicializar CidadeService:', err);
    }
  }


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  async getDiarias(): Promise<Diaria[]> {
    if (this.diarias().length) return this.diarias();
    try {
      const data = await firstValueFrom(this.http.get<Diaria[]>(`${this.backURL}/diarias`));
      this.diarias.set(data);

      console.log('Diarias carregadas com estados resolvidos: ', this.diariasUI());
      return data;
    } catch (err) {
      console.error('Erro ao buscar diarias:', err);
      return [];
    }
  }

  /**
   * Mapeia um objeto de UI para um de DTO
   * @param diariaUI é um objeto de UI
   * @returns Diaria
   */
  private UItoDto(diariaUI: DiariaUI): Diaria {

    const especialidades = this.especialidadeService.especialidadesDto;
    const especialidade = especialidades().find(e => +e.descricao === +diariaUI.especialidade)!.codigo_especialidade

    return new Diaria(
      diariaUI.codigoDia,
      diariaUI.quantidadeConsultas,
      especialidade
    );
  }

  private formatarDataAAAAMMDD(data: string | Date): string {
    const d = new Date(data);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}${mes}${dia}`;
  }

  /**
   * Mapeia um objeto de DTO para um de UI
   * @param diaria é um objeto de DTO
   * @returns DiariaUI
   */
  private DTOtoUI(diaria: Diaria): DiariaUI {

    const especialidades = this.especialidadeService.especialidadesDto;

    const especialidade = especialidades().find(e => +e.codigo_especialidade === +diaria.especialidadeId)!.descricao

    return new DiariaUI(
      diaria.codigoDia,
      this.formatarDataAAAAMMDD(diaria.codigoDia),
      diaria.quantidadeConsultas,
      especialidade
    );
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
    const url = `${environment.apiURL}/diarias/${dataFormatada}/${this.especialidadeService.especialidadesDto().find(e => e.descricao === ui.especialidade)!.codigo_especialidade}`;

    // DELETE: Assume-se uma rota com identificadores compostos (Data e EspecialidadeId)
    this.http.delete(url).subscribe({
      next: () => {
        this.diarias.update(diarias =>
          diarias.filter(d =>
            !(this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(ui.codigoDia).getTime() &&
              this.especialidadeService.especialidadesDto().find(e => e.codigo_especialidade === d.especialidadeId)!.descricao === ui.especialidade)
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
      const especialidadeId = this.especialidadeService.especialidadesDto().find(e => e.descricao === ui.especialidade)!.codigo_especialidade;
      const url = `${environment.apiURL}/diarias/${dataFormatada}/${especialidadeId}`;


      this.http.delete(url).subscribe({
        next: () => {
          this.diarias.update(diarias =>
            diarias.filter(d =>
              !(this.normalizeDate(d.codigoDia).getTime() === this.normalizeDate(ui.codigoDia).getTime() &&
                this.especialidadeService.especialidadesDto().find(e => e.codigo_especialidade === d.especialidadeId)!.descricao === ui.especialidade)
            )
          );
        },
        error: (err) => console.error(err)
      });
    }
  }
}

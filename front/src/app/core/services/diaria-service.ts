import {Injectable, signal, computed, inject} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Diaria from '../model/diaria/Diaria';
import DiariaUI from '../model/diaria/DiariaUI';
import {EspecialidadeService} from './especialidade-service';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiariaService {
  private especialidadeService = inject(EspecialidadeService);
  private http = inject(HttpClient);

  backURL = environment.apiURL;
  diarias = signal<Diaria[]>([]);

  diariasUI = computed<DiariaUI[]>(() =>
    this.diarias().map(d => this.DTOtoUI(d))
  );

  constructor() {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      await this.especialidadeService.getEspecialidades();
      await this.getDiarias();
    } catch (err) {
      console.error('Erro ao inicializar DiariaService:', err);
    }
  }

  private parseAAAAMMDDToDate(codigo: number | string): Date {
    const s = String(codigo).padStart(8, '0');
    const ano = Number(s.substring(0, 4));
    const mes = Number(s.substring(4, 6)) - 1;
    const dia = Number(s.substring(6, 8));
    return new Date(ano, mes, dia);
  }

  private formatDateToAAAAMMDD(date: Date | string): number {
    const d = new Date(date);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return Number(`${ano}${mes}${dia}`);
  }

  async getDiarias(): Promise<Diaria[]> {
    if (this.diarias().length) return this.diarias();

    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: any[] }>(`${this.backURL}/diarias`)
      );

      const lista = Array.isArray(response?.dados) ? response.dados.map(obj => Diaria.fromJSON(obj)) : [];
      this.diarias.set(lista);
      console.log('Diarias carregadas:', lista);
      return lista;
    } catch (err) {
      console.error('Erro ao buscar diarias:', err);
      return [];
    }
  }

  UItoDto(ui: DiariaUI): Diaria {
    const especialidades = this.especialidadeService.especialidadesDto();
    const esp = especialidades.find(e =>
      e.descricao === ui.especialidade || String(e.codigo_especialidade) === ui.especialidade
    );

    const codigo_dia = this.formatDateToAAAAMMDD(ui.codigoDia);
    const codigo_especialidade = esp ? Number(esp.codigo_especialidade) : 0;

    return new Diaria(codigo_dia, codigo_especialidade, ui.quantidadeConsultas);
  }

  DTOtoUI(dto: Diaria): DiariaUI {
    const especialidades = this.especialidadeService.especialidadesDto();
    const esp = especialidades.find(e => Number(e.codigo_especialidade) === Number(dto.codigo_especialidade));
    const especialidadeNome = esp ? esp.descricao : '';

    const dataDate = this.parseAAAAMMDDToDate(dto.codigo_dia);

    return new DiariaUI(dataDate, String(dto.codigo_dia).padStart(8, '0'), dto.quantidade_consultas, especialidadeNome);
  }


  private normalizeDate(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  createDiaria(ui: DiariaUI) {
    const dto = this.UItoDto(ui);
    return this.http.post<{ status: string; dados?: any; mensagem?: string }>(
      `${this.backURL}/diarias`,
      dto.toJSON()
    ).pipe(
      map(res => {
        if (res.status === 'ERRO') throw new Error(res.mensagem ?? 'Erro desconhecido');
        return res;
      })
    );
  }

//   this.diarias.update(list =>
//   list.map(d =>
//   String(d.codigo_dia) === ui.codigoDiaString &&
//   d.especialidade === especialidade?.descricao
//     ? { ...d, ...dto, especialidade: especialidade?.descricao }
// : d
// )
// );

  updateDiaria(ui: DiariaUI) {
    const dto = this.UItoDto(ui);

    this.http.put<{ status: string; dados?: any; mensagem?: string }>(`${this.backURL}/diarias/${ui.codigoDiaString}/${dto.codigo_especialidade}`, dto.toJSON())
      .subscribe({
        next: res => {
          const especialidade = this.especialidadeService.especialidadesDto().find(e => e.codigo_especialidade === dto.codigo_especialidade);
          this.diarias.update(list => list.map(d => (String(d.codigo_dia) === ui.codigoDiaString && especialidade!.codigo_especialidade === d.codigo_especialidade) ? dto : d));

        },
        error: err => console.error('Erro ao atualizar diária:', err)
      });
  }

  deleteDiaria(ui: DiariaUI) {
    const codigoDia = ui.codigoDiaString; // AAAAMMDD
    const esp = this.especialidadeService.especialidadesDto().find(e => e.descricao === ui.especialidade);
    const espId = esp ? esp.codigo_especialidade : 0;
    const url = `${this.backURL}/diarias/${codigoDia}/${espId}`;

    this.http.delete<{ status: string; mensagem?: string }>(url).subscribe({
      next: () => {
        this.diarias.update(list =>
          list.filter(d => !(String(d.codigo_dia) === String(codigoDia) && Number(d.codigo_especialidade) === Number(espId)))
        );
      },
      error: err => console.error('Erro ao deletar diária:', err)
    });
  }

  deleteDiarias(uis: DiariaUI[]) {
    for (const ui of uis) this.deleteDiaria(ui);
  }
}

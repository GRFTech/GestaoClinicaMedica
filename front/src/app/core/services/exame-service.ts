import {computed, inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Exame from '../model/exame/Exame';
import ExameUI from '../model/exame/ExameUI';
import {EspecialidadeService} from './especialidade-service';
import { HttpClient } from '@angular/common/http';
import Medico from '../model/medico/Medico';
import {firstValueFrom} from 'rxjs'; // 1. Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  // Injeções
  especialidadeService = inject(EspecialidadeService);
  private http = inject(HttpClient);

  // Propriedades e Signals
  backURL = environment.apiURL;
  private exames = signal<Exame[]>([]);

  examesDto = this.exames.asReadonly();

  // Mapeia o signal de DTO para UI
  examesUI = computed<ExameUI[]>(() =>
    this.exames().map(e => this.DTOtoUI(e))
  );

  constructor() {
    this.initializeData();
  }

  private async initializeData(): Promise<void> {
    try {
      await this.especialidadeService.getEspecialidades();
      await this.getExames();
    } catch (err) {
      console.error('Erro ao inicializar EspecialidadeService:', err);
    }
  }


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos.
   */
  async getExames(): Promise<Exame[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: Exame[] }>(`${this.backURL}/exames`)
      );

      console.log(response);


      const lista = Array.isArray(response?.dados) ? response.dados : [];

      this.exames.set(lista);

      console.log('Exames carregados com sucesso: ', this.examesUI());
      return lista;
    } catch (err) {
      console.error('Erro ao buscar exames:', err);
      return [];
    }
  }


  /**
   * Mapeia um objeto de UI (ExameUI) para um de banco (Exame)
   * @param exameUI é um objeto de UI
   * @returns Exame
   */
  private UItoDto(exameUI: ExameUI): Exame {

    const especialidades = this.especialidadeService.especialidadesDto;
    const especialidade = especialidades().find(e => e.descricao === exameUI.especialidade);

    return new Exame(
      exameUI.codigo_exame,
      exameUI.descricao,
      exameUI.valor,
      especialidade!.codigo_especialidade
    );
  }

  /**
   * Mapeia um objeto de banco (Exame) para um de UI (ExameUI)
   * @param exame é um objeto de banco
   * @returns ExameUI
   */
  private DTOtoUI(exame: Exame): ExameUI {
    const especialidades = this.especialidadeService.especialidadesDto;
    const especialidade = especialidades().find(e => e.codigo_especialidade === exame.codigo_especialidade);

    return new ExameUI(
      exame.codigo_exame,
      exame.descricao,
      exame.valor_exame,
      especialidade?.descricao ?? ''
    );
  }

  /**
   * Salva um novo exame no banco de dados.
   * @param ui é um objeto de UI
   */
  createExame(ui: ExameUI) {
    this.http.post<{ status: string; mensagem: string }>(`${environment.apiURL}/exames`, this.UItoDto(ui)).subscribe({
      next: response => {
        if (response.status === 'SUCESSO') {
          // Extrai o código do exame da mensagem do backend
          const match = response.mensagem.match(/\(Cód:\s*(\d+)\)/);

          if (match && match[1]) {
            ui.codigo_exame = parseInt(match[1], 10);
          }

          this.exames.update(exames => [...exames, this.UItoDto(ui)]);
          console.log(`Exame salvo com código: ${ui.codigo_exame}`);
        } else {
          console.error('Falha ao criar exame:', response.mensagem);
        }
      },
      error: err => console.error('Erro HTTP ao criar exame:', err)
    });
  }


  /**
   * Atualiza um exame existente no banco de dados.
   * @param ui é um objeto de UI
   */
  updateExame(ui: ExameUI) {
    let dto = this.UItoDto(ui);

    this.http.put<Exame>(`${environment.apiURL}/exames/${ui.codigo_exame}`, dto).subscribe({
      next: data => {
        this.exames.update(exames =>
          // 'data' é o DTO atualizado retornado pelo backend
          exames.map(e => (e.codigo_exame === ui.codigo_exame ? data : e))
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta um exame do banco de dados.
   * @param ui é um objeto de UI
   */
  deleteExame(ui: ExameUI) {
    this.http.delete(`${environment.apiURL}/exames/${ui.codigo_exame}`).subscribe({
      next: () => {
        this.exames.update(exames =>
          exames.filter(e => e.codigo_exame !== ui.codigo_exame)
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta vários exames selecionados do banco de dados.
   * @param uis é um array de objetos de UI
   */
  deleteExames(uis: ExameUI[]) {
    const ids = uis.map(u => u.codigo_exame);

    // Replicando a lógica de deletar em loop
    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/exames/${ids[i]}`).subscribe({
        next: () => {
          console.log(`Exame com id ${ids[i]} deletado`);
          // Atualiza o signal para remover o item que acabou de ser deletado
          this.exames.update(exames =>
            exames.filter(e => e.codigo_exame !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

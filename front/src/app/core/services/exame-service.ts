import {computed, inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Exame from '../model/exame/Exame';
import ExameUI from '../model/exame/ExameUI';
import {EspecialidadeService} from './especialidade-service';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  // Injeções
  especialidadeService = inject(EspecialidadeService);
  private http = inject(HttpClient); // 2. Injetar HttpClient

  // Propriedades e Signals
  backURL = environment.apiURL;
  private exames = signal<Exame[]>([]);

  examesDto = this.exames.asReadonly();

  // Mapeia o signal de DTO para UI
  examesUI = computed<ExameUI[]>(() =>
    this.exames().map(e => this.DTOtoUI(e))
  );

  constructor() {
    this.getExames();
  }

  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos.
   */
  getExames() {
    this.http.get<Exame[]>(`${environment.apiURL}/exames`) // Chamada HTTP GET
      .subscribe({
        next: data => {
          console.log(data);
          this.exames.set(data)
        },
        error: (err) => console.error(err)
      });
  }

  /**
   * Mapeia um objeto de UI (ExameUI) para um de banco (Exame)
   * @param exameUI é um objeto de UI
   * @returns Exame
   */
  private UItoDto(exameUI: ExameUI): Exame {
    const especialidade = this.especialidadeService.especialidadesDto().find(e => e.descricao === exameUI.especialidade);
    return new Exame(
      exameUI.id,
      exameUI.descricao,
      exameUI.valor,
      especialidade!.id
    );
  }

  /**
   * Mapeia um objeto de banco (Exame) para um de UI (ExameUI)
   * @param exame é um objeto de banco
   * @returns ExameUI
   */
  private DTOtoUI(exame: Exame): ExameUI {
    const especialidade = this.especialidadeService.especialidadesDto().find(e => e.id === exame.especialidadeId);
    return new ExameUI(
      exame.id,
      exame.descricao,
      exame.valor,
      especialidade?.descricao ?? ''
    );
  }

  /**
   * Salva um novo exame no banco de dados.
   * @param ui é um objeto de UI
   */
  createExame(ui: ExameUI) {
    let dto = this.UItoDto(ui);

    this.http.post<Exame>(`${environment.apiURL}/exames`, dto).subscribe({
      next: data => {
        // 'data' é o DTO retornado pelo backend (com ID, etc.)
        this.exames.update(exames => [...exames, data]);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza um exame existente no banco de dados.
   * @param ui é um objeto de UI
   */
  updateExame(ui: ExameUI) {
    let dto = this.UItoDto(ui);

    this.http.put<Exame>(`${environment.apiURL}/exames/${ui.id}`, dto).subscribe({
      next: data => {
        this.exames.update(exames =>
          // 'data' é o DTO atualizado retornado pelo backend
          exames.map(e => (e.id === ui.id ? data : e))
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
    this.http.delete(`${environment.apiURL}/exames/${ui.id}`).subscribe({
      next: () => {
        this.exames.update(exames =>
          exames.filter(e => e.id !== ui.id)
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
    const ids = uis.map(u => u.id);

    // Replicando a lógica de deletar em loop
    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/exames/${ids[i]}`).subscribe({
        next: () => {
          console.log(`Exame com id ${ids[i]} deletado`);
          // Atualiza o signal para remover o item que acabou de ser deletado
          this.exames.update(exames =>
            exames.filter(e => e.id !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

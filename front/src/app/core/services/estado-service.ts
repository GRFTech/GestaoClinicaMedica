import { Injectable, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Estado from '../model/estado/Estado';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from 'rxjs'; // Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  // Injeção de dependência
  private http = inject(HttpClient);

  // Propriedades
  backURL = environment.apiURL;
  private estados = signal<Estado[]>([]);

  // Exposição como Readonly
  estadosDto = this.estados.asReadonly();

  constructor() {
  }

  /** Carrega estados do backend e retorna quando concluído */


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos.
   */
  async getEstados(): Promise<Estado[]> {
    if (this.estados().length) return this.estados();
    try {
      const data = await firstValueFrom(this.http.get<Estado[]>(`${this.backURL}/estados`));
      this.estados.set(data);
      return data;
    } catch (err) {
      console.error('Erro ao buscar estados:', err);
      return [];
    }
  }

  /**
   * Salva um novo estado no banco de dados.
   * @param estado é um objeto de Estado
   */
  createEstado(estado: Estado) {
    this.http.post<Estado>(`${environment.apiURL}/estados`, estado).subscribe({
      next: data => {
        // 'data' é o objeto completo retornado pelo backend (com ID, se aplicável)
        this.estados.update(estados => [...estados, data]);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza um estado existente no banco de dados.
   * @param estado é um objeto de Estado
   */
  updateEstado(estado: Estado) {
    this.http.put<Estado>(`${environment.apiURL}/estados/${estado.id}`, estado).subscribe({
      next: data => {
        this.estados.update(estados =>
          estados.map(e => (e.id === estado.id ? data : e))
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta um estado do banco de dados.
   * @param estado é um objeto de Estado
   */
  deleteEstado(estado: Estado) {
    this.http.delete(`${environment.apiURL}/estados/${estado.id}`).subscribe({
      next: () => {
        this.estados.update(estados =>
          estados.filter(e => e.id !== estado.id)
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta vários estados selecionados do banco de dados.
   * @param estadosToDelete é um array de objetos de Estado
   */
  deleteEstados(estadosToDelete: Estado[]) {
    const ids = estadosToDelete.map(e => e.id);

    // Replicando a lógica de deletar em loop
    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/estados/${ids[i]}`).subscribe({
        next: () => {
          console.log(`Estado com id ${ids[i]} deletado`);
          // Atualiza o signal, garantindo que o item deletado seja removido
          this.estados.update(estados =>
            estados.filter(e => e.id !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

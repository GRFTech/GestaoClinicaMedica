import { computed, Injectable, Signal, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Especialidade from '../model/especialidade/Especialidade';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from 'rxjs'; // 1. Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {

  // Injeção de dependência
  private http = inject(HttpClient); // 1. Injetar HttpClient

  // Propriedades
  backURL = environment.apiURL;
  private especialidades = signal<Especialidade[]>([]);

  especialidadesDto = this.especialidades.asReadonly();

  // Não é necessário um objeto UI, então o DTO é o mesmo que a UI
  especialidadesUI = this.especialidades.asReadonly() as Signal<Especialidade[]>;

  constructor() {
    this.initializeData()
  }

  private async initializeData(): Promise<void> {
    try {
      await this.getEspecialidades();
    } catch (err) {
      console.error('Erro ao inicializar MedicoService:', err);
    }
  }


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos.
   */
  async getEspecialidades(): Promise<Especialidade[]> {
    if (this.especialidades().length) return this.especialidades();

    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: Especialidade[] }>(`${this.backURL}/especialidades`)
      );

      // Extrai o array de dados do backend
      const lista = Array.isArray(response?.dados) ? response.dados : [];

      this.especialidades.set(lista);

      console.log('Especialidades carregadas com sucesso:', lista);
      return lista;
    } catch (err) {
      console.error('Erro ao buscar especialidades:', err);
      return [];
    }
  }

  /**
   * Salva uma nova especialidade no banco de dados.
   * @param especialidade é um objeto de Especialidade
   */
  createEspecialidade(especialidade: Especialidade) {
    this.http.post<Especialidade>(`${environment.apiURL}/especialidades`, especialidade).subscribe({
      next: data => {
        // Assume-se que 'data' é o objeto completo (com ID gerado pelo backend)
        this.especialidades.update(e => [...e, data]);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza uma especialidade existente no banco de dados.
   * @param especialidade é um objeto de Especialidade
   */
  updateEspecialidade(especialidade: Especialidade) {
    console.log("Especialidade: ");
    this.http.put<Especialidade>(`${environment.apiURL}/especialidades/${especialidade.codigo_especialidade}`, especialidade).subscribe({
      next: data => {
        console.log(data)
        this.especialidades.update(especialidades =>
          especialidades.map(e => (e.codigo_especialidade === especialidade.codigo_especialidade ? data : e))
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta uma especialidade do banco de dados.
   * @param especialidade é um objeto de Especialidade
   */
  deleteEspecialidade(especialidade: Especialidade) {
    this.http.delete(`${environment.apiURL}/especialidades/${especialidade.codigo_especialidade}`).subscribe({
      next: () => {
        this.especialidades.update(especialidades =>
          especialidades.filter(e => e.codigo_especialidade !== especialidade.codigo_especialidade)
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta várias especialidades selecionadas do banco de dados.
   * @param especialidades é um array de objetos de Especialidade
   */
  deleteEspecialidades(especialidades: Especialidade[]) {
    const ids = especialidades.map(u => u.codigo_especialidade);

    // Replicando a lógica de deletar em loop (como no CidadeService)
    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/especialidades/${ids[i]}`).subscribe({
        next: () => {
          console.log(`Especialidade com id ${ids[i]} deletada`);
          // Atualiza o signal para remover o item que acabou de ser deletado
          this.especialidades.update(e =>
            e.filter(item => item.codigo_especialidade !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

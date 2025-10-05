import { computed, Injectable, Signal, signal, inject } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Especialidade from '../model/especialidade/Especialidade';
import { HttpClient } from '@angular/common/http';
import Estado from '../model/estado/Estado';
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
      const data = await firstValueFrom(this.http.get<Especialidade[]>(`${this.backURL}/especialidades`));
      this.especialidades.set(data);
      return data;
    } catch (err) {
      console.error('Erro ao buscar estados:', err);
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
    this.http.put<Especialidade>(`${environment.apiURL}/especialidades/${especialidade.id}`, especialidade).subscribe({
      next: data => {
        console.log(data)
        this.especialidades.update(especialidades =>
          especialidades.map(e => (e.id === especialidade.id ? data : e))
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
    this.http.delete(`${environment.apiURL}/especialidades/${especialidade.id}`).subscribe({
      next: () => {
        this.especialidades.update(especialidades =>
          especialidades.filter(e => e.id !== especialidade.id)
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
    const ids = especialidades.map(u => u.id);

    // Replicando a lógica de deletar em loop (como no CidadeService)
    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/especialidades/${ids[i]}`).subscribe({
        next: () => {
          console.log(`Especialidade com id ${ids[i]} deletada`);
          // Atualiza o signal para remover o item que acabou de ser deletado
          this.especialidades.update(e =>
            e.filter(item => item.id !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

import {computed, inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Medico from '../model/medico/Medico';
import MedicoUI from '../model/medico/MedicoUI';
import {CidadeService} from './cidade-service';
import {EspecialidadeService} from './especialidade-service';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  // Injeções de dependência
  cidadeService = inject(CidadeService)
  especialidadeService = inject(EspecialidadeService);
  private http = inject(HttpClient); // 2. Injetar HttpClient

  // Propriedades e Signals
  backURL = environment.apiURL;
  private medicos = signal<Medico[]>([]);

  medicosDto = this.medicos.asReadonly();

  medicosUI = computed<MedicoUI[]>(() =>
    this.medicos().map(m => this.DTOtoUI(m))
  );

  constructor() {
    Promise.all([
      this.cidadeService.getCidades(),
      this.especialidadeService.getEspecialidades()
    ]).then(() => this.getMedicos());
  }

  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos.
   */
  getMedicos() {
    this.http.get<Medico[]>(`${environment.apiURL}/medicos`) // Chamada HTTP GET
      .subscribe({
        next: data => {
          this.medicos.set(data)
        },
        error: (err) => console.error(err)
      });
  }

  /**
   * Mapeia um objeto de UI (MedicoUI) para um de banco (Medico)
   * @param medicoUI é um objeto de UI
   * @returns Medico
   */
  private UItoDto(medicoUI: MedicoUI): Medico {
    const cidade = this.cidadeService.cidadesDto().find(c => c.descricao === medicoUI.cidade);
    const especialidade = this.especialidadeService.especialidadesDto().find(e => e.descricao === medicoUI.especialidade);

    return new Medico(
      medicoUI.id,
      medicoUI.nome,
      medicoUI.endereco,
      medicoUI.telefone,
      cidade!.id,
      especialidade!.id
    );
  }

  /**
   * Mapeia um objeto de banco (Medico) para um de UI (MedicoUI)
   * @param medico é um objeto de banco
   * @returns MedicoUI
   */
  private DTOtoUI(medico: Medico): MedicoUI {
    const cidade = this.cidadeService.cidadesDto().find(c => c.id === medico.cidadeId);
    const especialidade = this.especialidadeService.especialidadesDto().find(e => e.id === medico.especialidadeId);

    return new MedicoUI(
      medico.id,
      medico.nome,
      medico.endereco,
      medico.telefone,
      cidade?.descricao ?? '',
      especialidade?.descricao ?? ''
    );
  }

  /**
   * Salva um novo médico no banco de dados
   * @param ui é um objeto de UI
   */
  createMedico(ui: MedicoUI) {
    let dto = this.UItoDto(ui);

    this.http.post<Medico>(`${environment.apiURL}/medicos`, dto).subscribe({
      next: data => {
        // 'data' é o DTO retornado pelo backend (com ID, etc.)
        this.medicos.update(medicos => [...medicos, data]);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza um médico existente no banco de dados
   * @param ui é um objeto de UI
   */
  updateMedico(ui: MedicoUI) {
    let dto = this.UItoDto(ui);

    this.http.put<Medico>(`${environment.apiURL}/medicos/${ui.id}`, dto).subscribe({
      next: data => {
        this.medicos.update(medicos =>
          // 'data' é o DTO atualizado retornado pelo backend
          medicos.map(m => (m.id === ui.id ? data : m))
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta um médico do banco de dados
   * @param ui é um objeto de UI
   */
  deleteMedico(ui: MedicoUI) {
    this.http.delete(`${environment.apiURL}/medicos/${ui.id}`).subscribe({
      next: () => {
        this.medicos.update(medicos =>
          medicos.filter(m => m.id !== ui.id)
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta vários médicos selecionados do banco de dados
   * @param uis é um array de objetos de UI
   */
  deleteMedicos(uis: MedicoUI[]) {
    const ids = uis.map(u => u.id);

    // Replicando a lógica de deletar em loop
    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/medicos/${ids[i]}`).subscribe({
        next: () => {
          console.log(`Médico com id ${ids[i]} deletado`);
          // Atualiza o signal para remover o item que acabou de ser deletado
          this.medicos.update(medicos =>
            medicos.filter(m => m.id !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

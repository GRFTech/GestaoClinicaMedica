import {Injectable, signal, computed, inject} from '@angular/core';
import Consulta from '../model/consulta/Consulta';
import ConsultaUI from '../model/consulta/ConsultaUI';
import { environment } from '../../../environments/environment.development';
import {PacienteService} from './paciente-service';
import {MedicoService} from './medico-service';
import {ExameService} from './exame-service';
import { HttpClient } from '@angular/common/http'; // 1. Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  // Injeções
  pacienteService = inject(PacienteService);
  medicoService = inject(MedicoService);
  exameService = inject(ExameService);
  private http = inject(HttpClient); // 2. Injetar HttpClient

  // Propriedades
  backURL = environment.apiURL;
  private consultas = signal<Consulta[]>([]);

  // Exposição DTO (caso precise em outro lugar)
  consultasDto = this.consultas.asReadonly();

  // Exposição já como UI
  consultasUI = computed<ConsultaUI[]>(() =>
    this.consultas().map(c => this.DTOtoUI(c))
  );

  // Construtor
  constructor() {
    this.getConsultas()
  }

  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  getConsultas() {
    this.http.get<Consulta[]>(`${environment.apiURL}/consultas`) // 3. Chamada HTTP GET
      .subscribe({
        next: data => {
          this.consultas.set(data)
        },
        error: (err) => console.error(err)
      });
  }

  /**
   * Mapeia um objeto de UI para um de banco
   * @param ui é um objeto de UI
   * @returns Consulta
   */
  private UItoDto(ui: ConsultaUI): Consulta {
    // A lógica de mapeamento para DTO permanece a mesma, mas é bom garantir que
    // PacienteService, MedicoService e ExameService já tenham carregado seus dados
    // antes de usar esse método.
    const paciente = this.pacienteService.pacientesDto().find(p => p.nome === ui.paciente);
    const medico = this.medicoService.medicosDto().find(m => m.nome === ui.medico);
    const exame = this.exameService.examesDto().find(e => e.descricao === ui.exame);

    // Nota: O construtor de Consulta pode precisar ser ajustado se o id for gerado no backend.
    // Assumindo que o ID é ignorado no POST/PUT e que a data é tratada corretamente.
    return new Consulta(ui.id, ui.data, paciente!.id, medico!.id, exame!.id);
  }

  /**
   * Mapeia um objeto de banco para um de UI
   * @param dto é um objeto de banco
   * @returns ConsultaUI
   */
  private DTOtoUI(dto: Consulta): ConsultaUI {
    const paciente = this.pacienteService.pacientesDto().find(p => p.id === dto.pacienteId);
    const medico = this.medicoService.medicosDto().find(m => m.id === dto.medicoId);
    const exame = this.exameService.examesDto().find(e => e.id === dto.exameId);
    return new ConsultaUI(dto.id, dto.data, paciente?.nome ?? '', medico?.nome ?? '', exame?.descricao ?? '');
  }

  /**
   * Salva uma consulta no banco de dados.
   * @param ui é um objeto de UI
   */
  createConsulta(ui: ConsultaUI) {
    let dto = this.UItoDto(ui);

    this.http.post<Consulta>(`${environment.apiURL}/consultas`, dto).subscribe({ // 4. Chamada HTTP POST
      next: data => {
        this.consultas.update(cs => [...cs, data]);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza uma consulta no banco de dados.
   * @param ui é um objeto de UI
   */
  updateConsulta(ui: ConsultaUI) {
    let dto = this.UItoDto(ui);

    this.http.put<Consulta>(`${environment.apiURL}/consultas/${ui.id}`, dto).subscribe({ // 4. Chamada HTTP PUT
      next: data => {
        this.consultas.update(cs =>
          cs.map(c => (c.id === ui.id ? data : c))
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta uma consulta no banco de dados.
   * @param ui é um objeto de UI
   */
  deleteConsulta(ui: ConsultaUI) {
    this.http.delete(`${environment.apiURL}/consultas/${ui.id}`).subscribe({ // 4. Chamada HTTP DELETE
      next: () => {
        this.consultas.update(cs => cs.filter(c => c.id !== ui.id));
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta várias consultas selecionadas do banco de dados.
   * @param uis é um array de objetos de UI
   */
  deleteConsultas(uis: ConsultaUI[]) {
    const ids = uis.map(u => u.id);

    // 4. Chamada HTTP DELETE para múltiplos (replicando a lógica do CidadeService)
    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/consultas/${ids[i]}`).subscribe({
        next: () => {
          console.log(`Consulta com id ${ids[i]} deletada`);
          this.consultas.update(cs =>
            cs.filter(c => c.id !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

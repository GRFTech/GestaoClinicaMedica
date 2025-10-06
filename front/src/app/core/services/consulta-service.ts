import {Injectable, signal, computed, inject} from '@angular/core';
import Consulta from '../model/consulta/Consulta';
import ConsultaUI from '../model/consulta/ConsultaUI';
import { environment } from '../../../environments/environment.development';
import {PacienteService} from './paciente-service';
import {MedicoService} from './medico-service';
import {ExameService} from './exame-service';
import { HttpClient } from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  // Injeções
  pacienteService = inject(PacienteService);
  medicoService = inject(MedicoService);
  exameService = inject(ExameService);
  private http = inject(HttpClient);

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
    this.initializeData();
  }

  /**
   * Método responsável por carregar os dados de maneira assíncrona e garantir que tudo apareça na UI
   */
  private async initializeData(): Promise<void> {
    try {
      await this.pacienteService.getPacientes();
      await this.medicoService.getMedicos();
      await this.exameService.getExames();
      await this.getConsultas();
    } catch (err) {
      console.error('Erro ao inicializar CidadeService:', err);
    }
  }


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  async getConsultas(): Promise<Consulta[]> {
    if (this.consultas().length) return this.consultas();
    try {
      const data = await firstValueFrom(this.http.get<Consulta[]>(`${this.backURL}/consultas`));
      this.consultas.set(data);

      console.log('Consultas carregadas com estados resolvidos: ', this.consultasUI());
      return data;
    } catch (err) {
      console.error('Erro ao buscar consultas:', err);
      return [];
    }
  }

  /**
   * Mapeia um objeto de UI para um de banco
   * @param ui é um objeto de UI
   * @returns Consulta
   */
  private UItoDto(ui: ConsultaUI): Consulta {

    const pacientes = this.pacienteService.pacientesDto;
    const paciente = pacientes().find(p => +p.nome === +ui.paciente);

    const medicos = this.medicoService.medicosDto;
    const medico = medicos().find(m => +m.nome === +ui.medico);

    const exames = this.exameService.examesDto;
    const exame = exames().find(e => +e.descricao === +ui.exame);

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
    const pacientes = this.pacienteService.pacientesDto;
    const paciente = pacientes().find(p => +p.id === +dto.pacienteId);

    const medicos = this.medicoService.medicosDto;
    const medico = medicos().find(m => +m.id === +dto.medicoId);

    const exames = this.exameService.examesDto;
    const exame = exames().find(e => +e.id === +dto.exameId);

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

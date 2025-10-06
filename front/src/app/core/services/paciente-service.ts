import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Paciente from '../model/paciente/Paciente';
import PacienteUI from '../model/paciente/PacienteUI';
import {CidadeService} from './cidade-service';
import { HttpClient } from '@angular/common/http';
import MedicoUI from '../model/medico/MedicoUI';
import {firstValueFrom} from 'rxjs';
import Medico from '../model/medico/Medico'; // Importar HttpClient

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  // Injeções de dependência
  cidadeService = inject(CidadeService);
  private http = inject(HttpClient);

  backURL = environment.apiURL;
  private pacientes = signal<Paciente[]>([]);

  pacientesDto = this.pacientes.asReadonly();

  pacientesUI = computed<PacienteUI[]>(() =>
    this.pacientes().map(m => this.DTOtoUI(m))
  );

  constructor() {
    this.initializeData();
  }


  /**
   * Método responsável por carregar os dados de maneira assíncrona e garantir que tudo apareça na UI
   */
  private async initializeData(): Promise<void> {
    try {
      await this.cidadeService.getCidades();
      await this.getPacientes();
    } catch (err) {
      console.error('Erro ao inicializar PacienteService:', err);
    }
  }


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos.
   */
  async getPacientes(): Promise<Paciente[]> {
    try {
      // 1. Chamada HTTP
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: Paciente[] }>(`${this.backURL}/pacientes`)
      );

      // 2. Extrai o array de pacientes (fallback para [] se não existir)
      const lista = Array.isArray(response?.dados) ? response.dados : [];

      // 3. Atualiza a signal
      this.pacientes.set(lista);

      console.log('Pacientes carregados com sucesso: ', this.pacientesUI());
      return lista;
    } catch (err) {
      console.error('Erro ao buscar pacientes:', err);
      return [];
    }
  }



  /**
   * Mapeia um objeto de UI (PacienteUI) para um de banco (Paciente)
   * @param pacienteUI é um objeto de UI
   * @returns Paciente
   */
  private UItoDto(pacienteUI: PacienteUI): Paciente {

    const cidades = this.cidadeService.cidadesDto;
    const cidade = cidades().find(c => +c.descricao === +pacienteUI.cidade);

    return new Paciente(
      pacienteUI.id,
      pacienteUI.nome,
      pacienteUI.dataNascimento,
      pacienteUI.endereco,
      pacienteUI.telefone,
      pacienteUI.peso,
      pacienteUI.altura,
      cidade!.codigo
    );
  }

  /**
   * Mapeia um objeto de banco (Paciente) para um de UI (PacienteUI)
   * CORRIGIDO: Usa optional chaining para evitar falha no carregamento assíncrono.
   * @param paciente é um objeto de banco
   * @returns PacienteUI
   */
  private DTOtoUI(paciente: Paciente): PacienteUI {

    const cidades = this.cidadeService.cidadesDto;
    const cidade = cidades().find(c => +c.codigo === +paciente.codigo_cidade);

    return new PacienteUI(
      paciente.codigo_paciente,
      paciente.nome,
      paciente.dataNascimento,
      paciente.endereco,
      paciente.telefone,
      paciente.peso,
      paciente.altura,
      cidade?.descricao ?? ''
    );
  }

  /**
   * Salva um novo paciente no banco de dados
   * @param ui é um objeto de UI
   */
  createPaciente(ui: PacienteUI) {
    const dto = this.UItoDto(ui);
    this.http.post<Paciente>(`${environment.apiURL}/pacientes`, dto).subscribe({
      next: data => {
        this.pacientes.update(pacientes => [...pacientes, data]);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza um paciente existente no banco de dados
   * @param ui é um objeto de UI
   */
  updatePaciente(ui: PacienteUI) {
    const dto = this.UItoDto(ui);
    this.http.put<Paciente>(`${environment.apiURL}/pacientes/${ui.id}`, dto).subscribe({
      next: data => {
        this.pacientes.update(pacientes =>
          pacientes.map(p => (p.codigo_paciente === ui.id ? data : p))
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta um paciente do banco de dados
   * @param ui é um objeto de UI
   */
  deletePaciente(ui: PacienteUI) {
    this.http.delete(`${environment.apiURL}/pacientes/${ui.id}`).subscribe({
      next: () => {
        this.pacientes.update(pacientes =>
          pacientes.filter(p => p.codigo_paciente !== ui.id)
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta vários pacientes selecionados do banco de dados
   * @param uis é um array de objetos de UI
   */
  deletePacientes(uis: PacienteUI[]) {
    const ids = uis.map(u => u.id);

    // Replicando o padrão de deleção em loop, atualizando o signal em cada sucesso
    for (const id of ids) {
      this.http.delete(`${environment.apiURL}/pacientes/${id}`).subscribe({
        next: () => {
          console.log(`Paciente com id ${id} deletado`);
          this.pacientes.update(pacientes =>
            pacientes.filter(p => p.codigo_paciente !== id)
          );
        },
        error: (err) => console.error(err)
      });
    }
  }
}

import {computed, inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Medico from '../model/medico/Medico';
import MedicoUI from '../model/medico/MedicoUI';
import {CidadeService} from './cidade-service';
import {EspecialidadeService} from './especialidade-service';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  cidadeService = inject(CidadeService)
  especialidadeService = inject(EspecialidadeService);

  constructor() {
    this.getMedicos();
  }

  backURL = environment.apiURL;
  private medicos = signal<Medico[]>([]);

  medicosDto = this.medicos.asReadonly();

  medicosUI = computed<MedicoUI[]>(() =>
    this.medicos().map(m => this.DTOtoUI(m))
  );

  getMedicos() {
    let c = [
      new Medico(1, 'Dr. João Silva', 'Rua das Flores, 123', '(11) 98765-4321', 1, 1),
      new Medico(2, 'Dra. Maria Oliveira', 'Av. Sete de Setembro, 45', '(21) 99876-5432', 2, 2),
      new Medico(3, 'Dr. Pedro Souza', 'Praça da Liberdade, 89', '(31) 98765-1234', 3, 3),
      new Medico(4, 'Dra. Ana Costa', 'Rua do Sol, 567', '(41) 99988-7766', 4, 4),
      new Medico(5, 'Dr. Carlos Ferreira', 'Av. Paulista, 1000', '(11) 91234-5678', 5, 5),
      new Medico(6, 'Dra. Luiza Martins', 'Rua da Praia, 200', '(51) 98765-9876', 6, 6),
      new Medico(7, 'Dr. Rafael Pereira', 'Travessa dos Ventos, 33', '(61) 99887-7766', 7, 7),
      new Medico(8, 'Dra. Beatriz Santos', 'Rua das Oliveiras, 10', '(71) 98765-4433', 8, 8),
      new Medico(9, 'Dr. Gustavo Almeida', 'Av. Brasil, 555', '(81) 9988-6655', 9, 9),
      new Medico(10, 'Dra. Juliana Lima', 'Rua da Consolação, 789', '(11) 97654-3210', 10, 10),
      new Medico(11, 'Dr. Daniel Rodrigues', 'Av. Rio Branco, 25', '(21) 98877-6655', 11, 11),
      new Medico(12, 'Dra. Patrícia Gomes', 'Rua Santa Efigênia, 400', '(31) 97654-4433', 12, 12),
      new Medico(13, 'Dr. Ricardo Santos', 'Av. Ipiranga, 50', '(51) 91212-3434', 13, 13),
      new Medico(14, 'Dra. Fernanda Castro', 'Rua da Paz, 777', '(41) 98787-6565', 14, 14),
      new Medico(15, 'Dr. Felipe Oliveira', 'Av. Copacabana, 1234', '(21) 99999-8888', 15, 15),
      new Medico(16, 'Dra. Mônica Sousa', 'Rua das Amoreiras, 80', '(11) 97777-6666', 16, 16),
      new Medico(17, 'Dr. Eduardo Nunes', 'Av. Boa Viagem, 90', '(81) 98888-7777', 17, 17),
      new Medico(18, 'Dra. Carolina Mendes', 'Rua Bela Vista, 11', '(61) 99888-9999', 18, 18),
      new Medico(19, 'Dr. Leonardo Costa', 'Rua da Alegria, 222', '(71) 97777-8888', 19, 19),
      new Medico(20, 'Dra. Gabriela Almeida', 'Av. Atlântica, 300', '(21) 96666-5555', 20, 20),
      new Medico(21, 'Dr. Bruno Lopes', 'Rua da Esperança, 15', '(11) 95555-4444', 21, 21),
      new Medico(22, 'Dra. Amanda Silva', 'Av. Sabiá, 77', '(51) 94444-3333', 22, 22),
      new Medico(23, 'Dr. Thiago Ribeiro', 'Rua das Gaivotas, 45', '(41) 93333-2222', 23, 23),
      new Medico(24, 'Dra. Débora Lins', 'Av. Beira-Mar, 10', '(81) 92222-1111', 24, 24),
      new Medico(25, 'Dr. Lucas Viana', 'Rua das Flores, 50', '(11) 91111-0000', 25, 25),
      new Medico(26, 'Dra. Viviane Dias', 'Av. do Contorno, 600', '(31) 90000-1111', 26, 26),
      new Medico(27, 'Dr. Fernando Pires', 'Rua da Saudade, 234', '(21) 98888-5555', 27, 27),
      new Medico(28, 'Dra. Camila Ramos', 'Av. das Castanheiras, 11', '(61) 99988-7766', 2, 1),
      new Medico(29, 'Dr. Igor Dantas', 'Rua dos Pinheiros, 12', '(11) 98765-1122', 4, 3),
      new Medico(30, 'Dra. Elisa Santos', 'Rua do Limoeiro, 50', '(51) 99887-2233', 6, 2)
    ];

    this.medicos.set(c);
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
      cidade!.descricao,
      especialidade!.descricao
    );
  }

  /**
   * Salva um novo médico no banco de dados
   * @param ui é um objeto de UI
   */
  createMedico(ui: MedicoUI) {
    this.medicos.update(medicos => [...medicos, this.UItoDto(ui)]);
  }

  /**
   * Atualiza um médico existente no banco de dados
   * @param ui é um objeto de UI
   */
  updateMedico(ui: MedicoUI) {
    this.medicos.update(medicos =>
      medicos.map(m => (m.id === ui.id ? this.UItoDto(ui) : m))
    );
  }

  /**
   * Deleta um médico do banco de dados
   * @param ui é um objeto de UI
   */
  deleteMedico(ui: MedicoUI) {
    this.medicos.update(medicos =>
      medicos.filter(m => m.id !== ui.id)
    );
  }

  /**
   * Deleta vários médicos selecionados do banco de dados
   * @param uis é um array de objetos de UI
   */
  deleteMedicos(uis: MedicoUI[]) {
    const ids = uis.map(u => u.id);
    this.medicos.update(medicos =>
      medicos.filter(m => !ids.includes(m.id))
    );
  }
}

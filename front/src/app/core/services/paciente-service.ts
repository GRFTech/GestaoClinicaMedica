import {computed, inject, Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Paciente from '../model/paciente/Paciente';
import PacienteUI from '../model/paciente/PacienteUI';
import {CidadeService} from './cidade-service';

@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  cidadeService = inject(CidadeService);

  constructor() {
    this.getPacientes()
  }

  backURL = environment.apiURL;
  private pacientes = signal<Paciente[]>([]);

  pacientesDto = this.pacientes.asReadonly();

  pacientesUI = computed<PacienteUI[]>(() =>
    this.pacientes().map(p => this.DTOtoUI(p))
  );

  /**
   * Retorna todos os dados mock.
   *
   * @return {Signal<Paciente[]>} um signal que retorna os pacientes mockados
   */
  getPacientes() {

    let c = [
      new Paciente(1, 'Alice Ribeiro', new Date('1990-05-15'), 'Rua das Flores, 100', '(11) 98765-1234', 70, 1.75, 1),
      new Paciente(2, 'Bruno Santos', new Date('1985-11-20'), 'Av. Paulista, 2000', '(11) 99876-5432', 85, 1.80, 2),
      new Paciente(3, 'Carla Oliveira', new Date('1998-03-03'), 'Rua da Consolação, 555', '(11) 91234-5678', 60, 1.65, 3),
      new Paciente(4, 'Daniel Pereira', new Date('1972-08-25'), 'Rua Bela Vista, 789', '(21) 98765-9876', 90, 1.78, 4),
      new Paciente(5, 'Elisa Costa', new Date('2000-01-10'), 'Av. Atlântica, 10', '(21) 99888-7777', 55, 1.60, 5),
      new Paciente(6, 'Fábio Fernandes', new Date('1988-06-01'), 'Rua Sete de Setembro, 300', '(31) 97777-6666', 78, 1.85, 6),
      new Paciente(7, 'Gabriela Lima', new Date('1995-09-19'), 'Av. do Contorno, 80', '(31) 96666-5555', 63, 1.70, 7),
      new Paciente(8, 'Henrique Souza', new Date('1975-04-12'), 'Rua da Liberdade, 45', '(41) 95555-4444', 88, 1.79, 8),
      new Paciente(9, 'Isabela Martins', new Date('1993-12-30'), 'Av. Ipiranga, 90', '(51) 94444-3333', 58, 1.68, 9),
      new Paciente(10, 'João Mello', new Date('1965-02-05'), 'Rua dos Andradas, 20', '(51) 93333-2222', 95, 1.76, 10),
      new Paciente(11, 'Leticia Ramos', new Date('2005-07-22'), 'Rua das Camélias, 15', '(61) 92222-1111', 52, 1.62, 11),
      new Paciente(12, 'Marcelo Alves', new Date('1980-10-10'), 'SQS 305, Bloco B', '(61) 91111-0000', 82, 1.83, 12),
      new Paciente(13, 'Natália Rocha', new Date('1991-04-04'), 'Rua da Ajuda, 55', '(71) 90000-9999', 67, 1.74, 13),
      new Paciente(14, 'Otávio Pires', new Date('1978-06-08'), 'Av. Tancredo Neves, 12', '(71) 98888-7777', 92, 1.81, 14),
      new Paciente(15, 'Paula Viana', new Date('1996-02-28'), 'Rua das Oliveiras, 222', '(81) 97777-6666', 61, 1.69, 15),
      new Paciente(16, 'Quirino Santos', new Date('1983-09-09'), 'Rua do Limoeiro, 33', '(81) 96666-5555', 80, 1.77, 16),
      new Paciente(17, 'Renata Castro', new Date('1970-11-17'), 'Av. Visconde de Jequitinhonha, 120', '(81) 95555-4444', 65, 1.66, 17),
      new Paciente(18, 'Sérgio Guedes', new Date('1999-01-20'), 'Rua da Glória, 88', '(11) 94444-3333', 75, 1.73, 18),
      new Paciente(19, 'Tania Borges', new Date('1986-05-23'), 'Av. Barão de Studart, 450', '(85) 93333-2222', 59, 1.67, 19),
      new Paciente(20, 'Vitor Hugo', new Date('1974-07-14'), 'Rua dos Ipês, 15', '(85) 92222-1111', 93, 1.88, 20),
      new Paciente(21, 'Wanda Xavier', new Date('1982-12-05'), 'Rua das Acácias, 99', '(62) 91111-0000', 68, 1.71, 21),
      new Paciente(22, 'Xavier Mendes', new Date('1979-08-08'), 'Av. 85, 130', '(62) 90000-9999', 84, 1.84, 22),
      new Paciente(23, 'Yara Duarte', new Date('1994-03-29'), 'Rua dos Pinheiros, 250', '(11) 98888-7777', 56, 1.63, 23),
      new Paciente(24, 'Zeca Lima', new Date('1968-10-02'), 'Rua da Saudade, 11', '(11) 97777-6666', 98, 1.70, 24),
      new Paciente(25, 'Ana Beatriz', new Date('1997-04-07'), 'Av. Washington Soares, 300', '(85) 96666-5555', 62, 1.64, 25),
      new Paciente(26, 'Bento Siqueira', new Date('1989-01-18'), 'Rua do Ouro, 120', '(31) 95555-4444', 86, 1.82, 26),
      new Paciente(27, 'Cristina Nunes', new Date('1971-06-21'), 'Av. Afonso Pena, 500', '(31) 94444-3333', 69, 1.72, 27),
      new Paciente(28, 'Diogo Freire', new Date('1992-09-05'), 'Rua Sete de Setembro, 80', '(51) 93333-2222', 76, 1.75, 1),
      new Paciente(29, 'Evelyn Santos', new Date('1987-11-11'), 'Rua da República, 100', '(51) 92222-1111', 54, 1.61, 2),
      new Paciente(30, 'Felipe Marinho', new Date('1976-02-14'), 'Av. Borges de Medeiros, 200', '(51) 91111-0000', 89, 1.86, 3),
    ];

    this.pacientes.set(c)
  }



  /**
   * Mapeia um objeto de UI (PacienteUI) para um de banco (Paciente)
   * @param pacienteUI é um objeto de UI
   * @returns Paciente
   */
  private UItoDto(pacienteUI: PacienteUI): Paciente {
    const cidade = this.cidadeService.cidadesDto().find(c => c.descricao === pacienteUI.cidade);
    return new Paciente(
      pacienteUI.id,
      pacienteUI.nome,
      pacienteUI.dataNascimento,
      pacienteUI.endereco,
      pacienteUI.telefone,
      pacienteUI.peso,
      pacienteUI.altura,
      cidade!.id
    );
  }

  /**
   * Mapeia um objeto de banco (Paciente) para um de UI (PacienteUI)
   * @param paciente é um objeto de banco
   * @returns PacienteUI
   */
  private DTOtoUI(paciente: Paciente): PacienteUI {
    const cidade = this.cidadeService.cidadesDto().find(c => c.id === paciente.cidadeId);
    return new PacienteUI(
      paciente.id,
      paciente.nome,
      paciente.dataNascimento,
      paciente.endereco,
      paciente.telefone,
      paciente.peso,
      paciente.altura,
      cidade!.descricao
    );
  }

  /**
   * Salva um novo paciente no "banco de dados"
   * @param ui é um objeto de UI
   */
  createPaciente(ui: PacienteUI) {
    this.pacientes.update(pacientes => [...pacientes, this.UItoDto(ui)]);
  }

  /**
   * Atualiza um paciente existente no "banco de dados"
   * @param ui é um objeto de UI
   */
  updatePaciente(ui: PacienteUI) {
    this.pacientes.update(pacientes =>
      pacientes.map(p => (p.id === ui.id ? this.UItoDto(ui) : p))
    );
  }

  /**
   * Deleta um paciente do "banco de dados"
   * @param ui é um objeto de UI
   */
  deletePaciente(ui: PacienteUI) {
    this.pacientes.update(pacientes =>
      pacientes.filter(p => p.id !== ui.id)
    );
  }

  /**
   * Deleta vários pacientes selecionados do "banco de dados"
   * @param uis é um array de objetos de UI
   */
  deletePacientes(uis: PacienteUI[]) {
    const ids = uis.map(u => u.id);
    this.pacientes.update(pacientes =>
      pacientes.filter(p => !ids.includes(p.id))
    );
  }
}

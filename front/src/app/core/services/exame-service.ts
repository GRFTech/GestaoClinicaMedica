import {computed, inject, Injectable, signal} from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Exame from '../model/exame/Exame';
import ExameUI from '../model/exame/ExameUI';
import {EspecialidadeService} from './especialidade-service';

@Injectable({
  providedIn: 'root'
})
export class ExameService {

  especialidadeService = inject(EspecialidadeService);

  constructor() {
    this.getExames();
  }

  backURL = environment.apiURL;
  private exames = signal<Exame[]>([]);

  examesDto = this.exames.asReadonly();

  // Mapeia o signal de DTO para UI
  examesUI = computed<ExameUI[]>(() =>
    this.exames().map(e => this.DTOtoUI(e))
  );

  getExames() {
    let c = [
      new Exame(1, 'Eletrocardiograma (ECG)', 80.00, 1),
      new Exame(2, 'Hemograma Completo', 50.00, 2),
      new Exame(3, 'Ressonância Magnética', 850.00, 7),
      new Exame(4, 'Tomografia Computadorizada', 600.00, 7),
      new Exame(5, 'Ultrassonografia', 150.00, 6),
      new Exame(6, 'Raio-X de Tórax', 90.00, 25),
      new Exame(7, 'Colonoscopia', 450.00, 10),
      new Exame(8, 'Endoscopia', 400.00, 10),
      new Exame(9, 'Teste Ergométrico', 200.00, 1),
      new Exame(10, 'Mamografia', 180.00, 6),
      new Exame(11, 'Densitometria Óssea', 170.00, 13),
      new Exame(12, 'Exame de Urina', 35.00, 2),
      new Exame(13, 'Exame de Fezes', 40.00, 2),
      new Exame(14, 'Holter 24h', 250.00, 1),
      new Exame(15, 'MAPA 24h', 230.00, 1),
      new Exame(16, 'Polissonografia', 700.00, 25),
      new Exame(17, 'Biópsia', 550.00, 15),
      new Exame(18, 'Teste Alérgico', 120.00, 27),
      new Exame(19, 'Exame Oftalmológico Completo', 100.00, 5),
      new Exame(20, 'Eletroencefalograma (EEG)', 150.00, 7),
      new Exame(21, 'Exame de Audiometria', 85.00, 12),
      new Exame(22, 'Cintilografia', 750.00, 22),
      new Exame(23, 'Hemoglobina Glicada', 60.00, 9),
      new Exame(24, 'Colesterol Total e Frações', 55.00, 9),
      new Exame(25, 'T3, T4, TSH', 70.00, 9),
      new Exame(26, 'Exame de Papanicolau', 110.00, 6),
      new Exame(27, 'Exame de Próstata (PSA)', 95.00, 11),
      new Exame(28, 'Ecocardiograma', 280.00, 1),
      new Exame(29, 'Avaliação Nutricional Completa', 130.00, 18),
      new Exame(30, 'Teste de Paternidade', 900.00, 2)
    ];

    this.exames.set(c);
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
      especialidade!.descricao
    );
  }

  /**
   * Salva um novo exame no "banco de dados".
   * @param ui é um objeto de UI
   */
  createExame(ui: ExameUI) {
    this.exames.update(exames => [...exames, this.UItoDto(ui)]);
  }

  /**
   * Atualiza um exame existente no "banco de dados".
   * @param ui é um objeto de UI
   */
  updateExame(ui: ExameUI) {
    this.exames.update(exames =>
      exames.map(e => (e.id === ui.id ? this.UItoDto(ui) : e))
    );
  }

  /**
   * Deleta um exame do "banco de dados".
   * @param ui é um objeto de UI
   */
  deleteExame(ui: ExameUI) {
    this.exames.update(exames =>
      exames.filter(e => e.id !== ui.id)
    );
  }

  /**
   * Deleta vários exames selecionados do "banco de dados".
   * @param uis é um array de objetos de UI
   */
  deleteExames(uis: ExameUI[]) {
    const ids = uis.map(u => u.id);
    this.exames.update(exames =>
      exames.filter(e => !ids.includes(e.id))
    );
  }
}

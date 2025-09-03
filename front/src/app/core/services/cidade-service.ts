import { Injectable, Signal, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Cidade from '../model/cidade/Cidade';
import { CidadeUI } from '../model/cidade/CidadeUI';
import { EstadoService } from './estado-service';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  backURL = environment.apiURL;
  private cidades = signal<Cidade[]>([]);

  // Exposição como readonly
  cidadesDto = this.cidades.asReadonly();

  // Exposição já como UI (mapeado automaticamente)
  cidadesUI = computed<CidadeUI[]>(() =>
    this.cidades().map(c => this.DTOtoUI(c))
  );

  constructor(private estadoService: EstadoService) {
    this.getCidades()
  }

  /**
   * Mock inicial
   */
  getCidades(){
    const c = [
      new Cidade(1, 'Rio Branco', 1),
      new Cidade(2, 'Maceió', 2),
      new Cidade(3, 'Macapá', 3),
      new Cidade(4, 'Manaus', 4),
      new Cidade(5, 'Salvador', 5),
      new Cidade(6, 'Fortaleza', 6),
      new Cidade(7, 'Brasília', 7),
      new Cidade(8, 'Vitória', 8),
      new Cidade(9, 'Goiânia', 9),
      new Cidade(10, 'São Luís', 10),
      new Cidade(11, 'Cuiabá', 11),
      new Cidade(12, 'Campo Grande', 12),
      new Cidade(13, 'Belo Horizonte', 13),
      new Cidade(14, 'Belém', 14),
      new Cidade(15, 'João Pessoa', 15),
      new Cidade(16, 'Curitiba', 16),
      new Cidade(17, 'Recife', 17),
      new Cidade(18, 'Teresina', 18),
      new Cidade(19, 'Rio de Janeiro', 19),
      new Cidade(20, 'Natal', 20),
      new Cidade(21, 'Porto Alegre', 21),
      new Cidade(22, 'Porto Velho', 22),
      new Cidade(23, 'Boa Vista', 23),
      new Cidade(24, 'Florianópolis', 24),
      new Cidade(25, 'São Paulo', 25),
      new Cidade(26, 'Aracaju', 26),
      new Cidade(27, 'Palmas', 27),
    ];

    this.cidades.set(c);
  }

  /**
   * Mapeia um objeto de UI para um de banco
   * @param cidadeUI é um objeto de UI
   * @returns Cidade
   */

  private UItoDto(cidadeUI: CidadeUI): Cidade {
    const estado = this.estadoService.estadosDto().find(e => e.estado === cidadeUI.estado);
    return new Cidade(cidadeUI.id, cidadeUI.descricao, estado!.id);
  }

  /**
   * Mapeia um objeto de banco para um de UI
   * @param cidade é um objeto de banco
   * @returns Cidade
   */
  private DTOtoUI(cidade: Cidade): CidadeUI {
    const estado = this.estadoService.estadosDto().find(e => e.id === cidade.estadoId);
    return new CidadeUI(cidade.id, cidade.descricao, estado?.estado ?? '');
  }

  /**
   * Salva uma cidade no banco de dados.
   * @param ui é um objeto de UI
   */
  createCidade(ui: CidadeUI) {
    this.cidades.update(cidades => [...cidades, this.UItoDto(ui)]);
  }

  /**
   * Atualiza um objeto no banco de dados
   * @param ui é um objeto de UI
   */
  updateCidade(ui: CidadeUI) {
    this.cidades.update(cidades =>
      cidades.map(c => (c.id === ui.id ? this.UItoDto(ui) : c))
    );
  }

  /**
   * Deleta um objeto do banco de dadas.
   * @param ui é um objeto de UI
   */
  deleteCidade(ui: CidadeUI) {
    this.cidades.update(cidades =>
      cidades.filter(c => c.id !== ui.id)
    );
  }

  /**
   * Deleta varios objetos selecionados do banco de dados.
   * @param uis é um array de objetos de UI
   */
  deleteCidades(uis: CidadeUI[]) {
    const ids = uis.map(u => u.id);
    this.cidades.update(cidades =>
      cidades.filter(c => !ids.includes(c.id))
    );
  }
}

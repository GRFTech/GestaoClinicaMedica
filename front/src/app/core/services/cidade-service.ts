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
      new Cidade(1, 'São Paulo', 10),
      new Cidade(2, 'Rio de Janeiro', 9),
      new Cidade(3, 'Belo Horizonte', 8),
      new Cidade(4, 'Curitiba', 7),
      new Cidade(5, 'Porto Alegre', 6),
      new Cidade(6, 'Salvador', 5),
      new Cidade(7, 'Fortaleza', 4),
      new Cidade(8, 'Manaus', 3),
      new Cidade(9, 'Recife', 2),
      new Cidade(10, 'Florianópolis', 1),
    ];

    this.cidades.set(c);
  }

  /**
   * Mapeia um objeto de UI para um de banco
   * @param cidadeUI é um objeto de UI
   * @returns Cidade
   */

  private UItoDto(cidadeUI: CidadeUI): Cidade {
    const estado = this.estadoService.estados().find(e => e.estado === cidadeUI.estado);
    return new Cidade(cidadeUI.id, cidadeUI.descricao, estado!.id);
  }

  /**
   * Mapeia um objeto de banco para um de UI
   * @param cidade é um objeto de banco
   * @returns Cidade
   */
  private DTOtoUI(cidade: Cidade): CidadeUI {
    const estado = this.estadoService.estados().find(e => e.id === cidade.estadoId);
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

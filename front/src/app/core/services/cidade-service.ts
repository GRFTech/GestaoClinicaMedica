import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Cidade from '../model/cidade/Cidade';
import { CidadeUI } from '../model/cidade/CidadeUI';
import { EstadoService } from './estado-service';
import {HttpClient} from '@angular/common/http';

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

  constructor(private estadoService: EstadoService, private http: HttpClient) {
    this.getCidades()
  }

  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  getCidades(){
    this.http.get<Cidade[]>(`${environment.apiURL}/cidades`)
      .subscribe({
        next: data => {
          console.log(data);
          console.log(data[0].id)
          this.cidades.set(data)
        },
        error: (err) => console.error(err)
      });
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

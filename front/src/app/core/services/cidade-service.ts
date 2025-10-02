import {Injectable, signal, computed} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Cidade from '../model/cidade/Cidade';
import {CidadeUI} from '../model/cidade/CidadeUI';
import {EstadoService} from './estado-service';
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
    Promise.all([
      this.estadoService.getEstados()
    ]).then(() => this.getCidades());
  }

  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  getCidades() {
    this.http.get<Cidade[]>(`${environment.apiURL}/cidades`)
      .subscribe({
        next: data => {
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

    let dto = this.UItoDto(ui);


    this.http.post<Cidade>(`${environment.apiURL}/cidades`, dto).subscribe({
      next: data => {
        this.cidades.update(cidades => [...cidades, data]);
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Atualiza um objeto no banco de dados
   * @param ui é um objeto de UI
   */
  updateCidade(ui: CidadeUI) {

    let dto = this.UItoDto(ui);

    this.http.put<Cidade>(`${environment.apiURL}/cidades/${ui.id}`, dto).subscribe({
      next: data => {
        this.cidades.update(cidades =>
          cidades.map(c => (c.id === ui.id ? data : c))
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta um objeto do banco de dadas.
   * @param ui é um objeto de UI
   */
  deleteCidade(ui: CidadeUI) {
    this.http.delete(`${environment.apiURL}/cidades/${ui.id}`).subscribe({
      next: data => {
        this.cidades.update(cidades =>
          cidades.filter(c => c.id !== ui.id)
        );
      },
      error: (err) => console.error(err)
    });
  }

  /**
   * Deleta varios objetos selecionados do banco de dados.
   * @param uis é um array de objetos de UI
   */
  deleteCidades(uis: CidadeUI[]) {
    const ids = uis.map(u => u.id);

    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/cidades/${ids[i]}`).subscribe({
        next: data => {
          console.log("deletou")
          this.cidades.update(cidades =>
            cidades.filter(c => c.id !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }
}

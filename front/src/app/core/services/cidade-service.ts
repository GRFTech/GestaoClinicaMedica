import {Injectable, signal, computed} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Cidade from '../model/cidade/Cidade';
import {CidadeUI} from '../model/cidade/CidadeUI';
import {EstadoService} from './estado-service';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

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
    this.initializeData()
  }


  /**
   * Método responsável por carregar os dados de maneira assíncrona e garantir que tudo apareça na UI
   */
  private async initializeData(): Promise<void> {
    try {
      await this.estadoService.getEstados();
      await this.getCidades();
    } catch (err) {
      console.error('Erro ao inicializar CidadeService:', err);
    }
  }


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  async getCidades(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Cidade[]>(`${this.backURL}/cidades`));
      this.cidades.set(data);

      console.log('Cidades carregadas com estados resolvidos:', this.cidadesUI());
    } catch (err) {
      console.error('Erro ao buscar cidades:', err);
    }
  }

  /**
   * Mapeia um objeto de UI para um de banco
   * @param cidadeUI é um objeto de UI
   * @returns Cidade
   */
  private UItoDto(cidadeUI: CidadeUI): Cidade {
    const estados = this.estadoService.estadosDto;
    const estado = estados().find(e => e.estado === cidadeUI.estado);
    return new Cidade(cidadeUI.id, cidadeUI.descricao, estado?.id ?? 0);
  }

  /**
   * Mapeia um objeto de banco para um de UI
   * @param cidade é um objeto de banco
   * @returns Cidade
   */
  private DTOtoUI(cidade: Cidade): CidadeUI {
    const estados = this.estadoService.estadosDto;
    const estado = estados().find(e => +e.id === +cidade.estadoId); // 🔹 comparando number x string
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

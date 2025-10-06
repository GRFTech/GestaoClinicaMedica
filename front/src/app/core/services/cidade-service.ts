import {Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {CidadeUI} from '../model/cidade/CidadeUI';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {
  backURL = environment.apiURL;
  private cidades = signal<CidadeUI[]>([]);

  // Exposição como readonly
  cidadesDto = this.cidades.asReadonly();


  constructor(private http: HttpClient) {
    this.initializeData();
  }


  /**
   * Método responsável por carregar os dados de maneira assíncrona e garantir que tudo apareça na UI
   */
  private async initializeData(): Promise<void> {
    try {
      await this.getCidades();
    } catch (err) {
      console.error('Erro ao inicializar CidadeService:', err);
    }
  }


  /**
   * Busca os dados no endpoint e inicializa a lista com os dados recebidos
   */
  async getCidades(): Promise<CidadeUI[]> {
    if (this.cidades().length) return this.cidades();

    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: CidadeUI[] }>(`${this.backURL}/cidades`)
      );

      const lista = response.dados ?? [];

      this.cidades.set(lista);
      console.log('Cidades carregadas com estados resolvidos:', this.cidadesDto());

      return lista;
    } catch (err) {
      console.error('Erro ao buscar cidades:', err);
      return [];
    }
  }


  /**
   * Salva uma cidade no banco de dados.
   * @param ui é um objeto de UI
   */
  createCidade(ui: CidadeUI) {
    this.http.post<{ status: string; mensagem: string }>(`${environment.apiURL}/cidades`, ui).subscribe({
      next: response => {
        if (response.status === 'SUCESSO') {
          const match = response.mensagem.match(/\(Cód:\s*(\d+)\)/);

          if (match && match[1]) {
            ui.codigo = parseInt(match[1], 10);
          }

          this.cidades.update(cidades => [...cidades, ui]);
          console.log(`Cidade salva com código: ${ui.codigo}`);
        } else {
          console.error('Falha ao criar cidade:', response.mensagem);
        }
      },
      error: err => console.error('Erro HTTP ao criar cidade:', err)
    });
  }



  /**
   * Atualiza um objeto no banco de dados
   * @param ui é um objeto de UI
   */
  updateCidade(ui: CidadeUI) {
    this.http.put<{ status: string; mensagem: string }>(
      `${environment.apiURL}/cidades/${ui.codigo}`,
      ui
    ).subscribe({
      next: response => {
        if (response.status === 'SUCESSO') {
          this.cidades.update(cidades =>
            cidades.map(c =>
              c.codigo === ui.codigo
                ? { ...c, ...ui }
                : c
            )
          );
          console.log(`Cidade ${ui.descricao} atualizada com sucesso.`);
        } else {
          console.error('Falha ao atualizar cidade:', response.mensagem);
        }
      },
      error: err => console.error('Erro HTTP ao atualizar cidade:', err)
    });
  }


  /**
   * Deleta um objeto do banco de dadas.
   * @param ui é um objeto de UI
   */
  deleteCidade(ui: CidadeUI) {
    this.http.delete(`${environment.apiURL}/cidades/${ui.codigo}`).subscribe({
      next: data => {
        this.cidades.update(cidades =>
          cidades.filter(c => c.codigo !== ui.codigo)
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
    const ids = uis.map(u => u.codigo);

    for (let i = 0; i < ids.length; i++) {
      this.http.delete(`${environment.apiURL}/cidades/${ids[i]}`).subscribe({
        next: data => {
          console.log("deletou")
          this.cidades.update(cidades =>
            cidades.filter(c => c.codigo !== ids[i])
          );
        },
        error: (err) => console.error(err)
      })
    }
  }


  /**
   * Busca uma cidade específica pelo código (ID) no backend.
   * @param codigo Código da cidade.
   */
  async getCidadeById(codigo: number): Promise<CidadeUI | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ status: string; dados: CidadeUI }>(`${this.backURL}/cidades/${codigo}`)
      );

      if (response.status === 'SUCESSO' && response.dados) {
        console.log('Cidade carregada com sucesso:', response.dados);
        return new CidadeUI(
          response.dados.codigo,
          response.dados.descricao,
          response.dados.estado
        );
      } else {
        console.error('Falha ao buscar cidade:', response);
        return null;
      }
    } catch (err) {
      console.error(`Erro ao buscar cidade com código ${codigo}:`, err);
      return null;
    }
  }
}

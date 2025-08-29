import {Injectable, Signal, signal} from '@angular/core';
import Cidade from '../model/Cidade';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

  // constructor(private http: HttpClient) { }

  backURL = environment.apiURL;
  cidades = signal<Cidade[]>([]);

  /**
   * Retorna todas as cidades mock.
   *
   * @return {Signal<Cidade[]>} um signal que retorna as cidades mockadas
   */
  getCidades(): Signal<Cidade[]> {

    let c = [
      new Cidade(1, "São Paulo", 10),
      new Cidade(2, "Rio de Janeiro", 9),
      new Cidade(3, "Belo Horizonte", 8),
      new Cidade(4, "Curitiba", 7),
      new Cidade(5, "Porto Alegre", 6),
      new Cidade(6, "Salvador", 5),
      new Cidade(7, "Fortaleza", 4),
      new Cidade(8, "Manaus", 3),
      new Cidade(9, "Recife", 2),
      new Cidade(10, "Florianópolis", 1)
    ];

    this.cidades.set(c)
    return this.cidades;
  }

  /**
   * Retorna todas as cidades cadastradas na API.
   *
   * @return {Observable<Cidade[]>} um observable que emite um array de cidades
   */

  // getCidades(): Observable<Cidade[]> {
  //   return this.http.get<Cidade[]>(`${environment.apiURL}/api/cidades/all`);
  // }
}

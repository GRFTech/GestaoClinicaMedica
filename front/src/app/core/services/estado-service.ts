import {computed, Injectable, Signal, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Diaria from '../model/Diaria';
import Estado from '../model/Estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

  constructor() {
    this.getEstados()
  }

  backURL = environment.apiURL;
  private estados = signal<Estado[]>([]);

  // Exposição como Readonly
  estadosDto = this.estados.asReadonly();

  // estadosUI = computed<EstadoUI[]>()

  /**
   * Retorna todos os dados mock.
   *
   * @return {Signal<Estado[]>} um signal que retorna os estados mockados
   */
  getEstados() {

    let c = [
      new Estado(1, 'Acre'),
      new Estado(2, 'Alagoas'),
      new Estado(3, 'Amapá'),
      new Estado(4, 'Amazonas'),
      new Estado(5, 'Bahia'),
      new Estado(6, 'Ceará'),
      new Estado(7, 'Distrito Federal'),
      new Estado(8, 'Espírito Santo'),
      new Estado(9, 'Goiás'),
      new Estado(10, 'Maranhão'),
      new Estado(11, 'Mato Grosso'),
      new Estado(12, 'Mato Grosso do Sul'),
      new Estado(13, 'Minas Gerais'),
      new Estado(14, 'Pará'),
      new Estado(15, 'Paraíba'),
      new Estado(16, 'Paraná'),
      new Estado(17, 'Pernambuco'),
      new Estado(18, 'Piauí'),
      new Estado(19, 'Rio de Janeiro'),
      new Estado(20, 'Rio Grande do Norte'),
      new Estado(21, 'Rio Grande do Sul'),
      new Estado(22, 'Rondônia'),
      new Estado(23, 'Roraima'),
      new Estado(24, 'Santa Catarina'),
      new Estado(25, 'São Paulo'),
      new Estado(26, 'Sergipe'),
      new Estado(27, 'Tocantins'),
    ];

    this.estados.set(c)
  }
}

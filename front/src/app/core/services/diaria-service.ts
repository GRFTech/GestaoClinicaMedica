import {Injectable, Signal, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Diaria from '../model/Diaria';

@Injectable({
  providedIn: 'root'
})
export class DiariaService {




  backURL = environment.apiURL;
  diarias = signal<Diaria[]>([]);

  /**
   * Retorna todos os dados mock.
   *
   * @return {Signal<Diaria[]>} um signal que retorna as diarias mockadas
   */
  getDiarias(): Signal<Diaria[]> {

    let c = [
      new Diaria(new Date('2024-10-26'), 15, 1),
      new Diaria(new Date('2024-10-26'), 8, 2),
      new Diaria(new Date('2024-10-26'), 12, 3),
      new Diaria(new Date('2024-10-27'), 10, 1),
      new Diaria(new Date('2024-10-27'), 5, 2),
      new Diaria(new Date('2024-10-27'), 14, 3),
      new Diaria(new Date('2024-10-28'), 18, 1),
      new Diaria(new Date('2024-10-28'), 7, 2),
      new Diaria(new Date('2024-10-28'), 10, 3),
      new Diaria(new Date('2024-10-29'), 11, 1),
      new Diaria(new Date('2024-10-29'), 9, 2),
      new Diaria(new Date('2024-10-29'), 15, 3),
      new Diaria(new Date('2024-10-30'), 13, 1),
      new Diaria(new Date('2024-10-30'), 12, 2),
      new Diaria(new Date('2024-10-30'), 8, 3),
      new Diaria(new Date('2024-10-31'), 16, 1),
      new Diaria(new Date('2024-10-31'), 6, 2),
      new Diaria(new Date('2024-10-31'), 11, 3),
      new Diaria(new Date('2024-11-01'), 20, 1),
      new Diaria(new Date('2024-11-01'), 9, 2),
      new Diaria(new Date('2024-11-01'), 13, 3),
      new Diaria(new Date('2024-11-02'), 14, 1),
      new Diaria(new Date('2024-11-02'), 10, 2),
      new Diaria(new Date('2024-11-02'), 7, 3),
      new Diaria(new Date('2024-11-03'), 19, 1),
      new Diaria(new Date('2024-11-03'), 8, 2),
      new Diaria(new Date('2024-11-03'), 16, 3),
      new Diaria(new Date('2024-11-04'), 17, 1),
      new Diaria(new Date('2024-11-04'), 11, 2),
      new Diaria(new Date('2024-11-04'), 9, 3)
    ];

    this.diarias.set(c)
    return this.diarias;
  }
}

import {Injectable, Signal, signal} from '@angular/core';
import Consulta from '../model/Consulta';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {

  // constructor(private http: HttpClient) { }

  backURL = environment.apiURL;
  consultas = signal<Consulta[]>([]);

  /**
   * Retorna todas as consultas mock.
   *
   * @return {Signal<Consulta[]>} um signal que retorna as cidades mockadas
   */
  getConsultas(): Signal<Consulta[]> {

    let c = [
      new Consulta(1, new Date(), 10, 33, 908),
      new Consulta(2, new Date('2025-09-01T10:00:00'), 12, 35, 910),
      new Consulta(3, new Date('2025-09-02T11:30:00'), 15, 38, 912),
      new Consulta(4, new Date('2025-09-03T09:00:00'), 18, 40, 915),
      new Consulta(5, new Date('2025-09-04T14:15:00'), 20, 42, 918),
      new Consulta(6, new Date('2025-09-05T08:45:00'), 22, 45, 920),
      new Consulta(7, new Date('2025-09-06T16:00:00'), 25, 48, 922),
      new Consulta(8, new Date('2025-09-07T13:00:00'), 28, 50, 925),
      new Consulta(9, new Date('2025-09-08T10:30:00'), 30, 52, 928),
      new Consulta(10, new Date('2025-09-09T11:00:00'), 32, 55, 930),
      new Consulta(11, new Date('2025-09-10T15:00:00'), 35, 58, 932),
      new Consulta(12, new Date('2025-09-11T12:00:00'), 38, 60, 935),
      new Consulta(13, new Date('2025-09-12T09:30:00'), 40, 62, 938),
      new Consulta(14, new Date('2025-09-13T14:45:00'), 42, 65, 940),
      new Consulta(15, new Date('2025-09-14T16:30:00'), 45, 68, 942),
      new Consulta(16, new Date('2025-09-15T08:00:00'), 48, 70, 945),
      new Consulta(17, new Date('2025-09-16T11:15:00'), 50, 72, 948),
      new Consulta(18, new Date('2025-09-17T13:45:00'), 52, 75, 950),
      new Consulta(19, new Date('2025-09-18T10:00:00'), 55, 78, 952),
      new Consulta(20, new Date('2025-09-19T09:30:00'), 58, 80, 955),
      new Consulta(21, new Date('2025-09-20T12:00:00'), 60, 82, 958),
      new Consulta(22, new Date('2025-09-21T15:00:00'), 62, 85, 960),
      new Consulta(23, new Date('2025-09-22T10:45:00'), 65, 88, 962),
      new Consulta(24, new Date('2025-09-23T11:00:00'), 68, 90, 965),
      new Consulta(25, new Date('2025-09-24T14:00:00'), 70, 92, 968),
      new Consulta(26, new Date('2025-09-25T16:00:00'), 72, 95, 970),
    ];

    this.consultas.set(c)
    return this.consultas;
  }


}

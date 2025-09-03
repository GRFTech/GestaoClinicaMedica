import {computed, Injectable, Signal, signal} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import Especialidade from '../model/Especialidade';

@Injectable({
  providedIn: 'root'
})
export class EspecialidadeService {


  constructor() {
    this.getEspecialidades()
  }

  backURL = environment.apiURL;
  private especialidades = signal<Especialidade[]>([]);

  especialidadesDto = this.especialidades.asReadonly();

  // especialidadesUI = computed<EspecialidadeUI[]>(() =>)

  /**
   * Retorna todos os dados mock.
   *
   * @return {Signal<Especialidade[]>} um signal que retorna as especialidades mockadas
   */
  getEspecialidades() {

    let c = [
      new Especialidade(1, 'Cardiologia', 250.00, 15),
      new Especialidade(2, 'Pediatria', 220.50, 20),
      new Especialidade(3, 'Dermatologia', 300.00, 12),
      new Especialidade(4, 'Ortopedia', 280.00, 18),
      new Especialidade(5, 'Oftalmologia', 350.00, 10),
      new Especialidade(6, 'Ginecologia', 275.00, 16),
      new Especialidade(7, 'Neurologia', 400.00, 8),
      new Especialidade(8, 'Psiquiatria', 380.00, 9),
      new Especialidade(9, 'Endocrinologia', 320.00, 14),
      new Especialidade(10, 'Gastroenterologia', 310.00, 13),
      new Especialidade(11, 'Urologia', 290.00, 15),
      new Especialidade(12, 'Otorrinolaringologia', 260.00, 17),
      new Especialidade(13, 'Reumatologia', 330.00, 11),
      new Especialidade(14, 'Nefrologia', 345.00, 10),
      new Especialidade(15, 'Oncologia', 500.00, 7),
      new Especialidade(16, 'Infectologia', 305.00, 12),
      new Especialidade(17, 'Fisioterapia', 150.00, 25),
      new Especialidade(18, 'Nutrição', 180.00, 20),
      new Especialidade(19, 'Psicologia', 200.00, 18),
      new Especialidade(20, 'Cirurgia Geral', 450.00, 6),
      new Especialidade(21, 'Anestesiologia', 420.00, 5),
      new Especialidade(22, 'Radiologia', 370.00, 10),
      new Especialidade(23, 'Medicina Esportiva', 285.00, 14),
      new Especialidade(24, 'Geriatria', 360.00, 11),
      new Especialidade(25, 'Pneumologia', 300.00, 13),
      new Especialidade(26, 'Angiologia', 315.00, 10),
      new Especialidade(27, 'Imunologia', 390.00, 8),
      new Especialidade(28, 'Homeopatia', 230.00, 15),
      new Especialidade(29, 'Acupuntura', 240.00, 14),
      new Especialidade(30, 'Odontologia', 210.00, 20)
    ];

    this.especialidades.set(c)
  }
}

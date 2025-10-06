export default class Consulta {
  private _codigo_consulta: number;
  private _codigo_paciente: number;
  private _codigo_medico: number;
  private _codigo_exame: number;
  private _data: string;
  private _hora: string;

  constructor(
    codigo_consulta: number = 0,
    codigo_paciente: number = 0,
    codigo_medico: number = 0,
    codigo_exame: number = 0,
    data: string = '',
    hora: string = ''
  ) {
    this._codigo_consulta = codigo_consulta;
    this._codigo_paciente = codigo_paciente;
    this._codigo_medico = codigo_medico;
    this._codigo_exame = codigo_exame;
    this._data = data;
    this._hora = hora;
  }

  // --- Getters e Setters ---

  get codigo_consulta(): number {
    return this._codigo_consulta;
  }
  set codigo_consulta(value: number) {
    this._codigo_consulta = value;
  }

  get codigo_paciente(): number {
    return this._codigo_paciente;
  }
  set codigo_paciente(value: number) {
    this._codigo_paciente = value;
  }

  get codigo_medico(): number {
    return this._codigo_medico;
  }
  set codigo_medico(value: number) {
    this._codigo_medico = value;
  }

  get codigo_exame(): number {
    return this._codigo_exame;
  }
  set codigo_exame(value: number) {
    this._codigo_exame = value;
  }

  get data(): string {
    return this._data;
  }
  set data(value: string) {
    this._data = value;
  }

  get hora(): string {
    return this._hora;
  }
  set hora(value: string) {
    this._hora = value;
  }

  // --- Serialização para envio ao backend ---
  toJSON() {
    return {
      codigo_consulta: this._codigo_consulta,
      codigo_paciente: this._codigo_paciente,
      codigo_medico: this._codigo_medico,
      codigo_exame: this._codigo_exame,
      data: this._data,
      hora: this._hora
    };
  }

  // --- Criação a partir de JSON do backend ---
  static fromJSON(json: any): Consulta {
    return new Consulta(
      json.codigo_consulta ?? 0,
      json.codigo_paciente ?? 0,
      json.codigo_medico ?? 0,
      json.codigo_exame ?? 0,
      json.data ?? '',
      json.hora ?? ''
    );
  }
}

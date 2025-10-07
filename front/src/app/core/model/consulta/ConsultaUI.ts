export default class ConsultaUI {
  private _codigo_consulta: number;
  private _data: Date;
  private _paciente: string;
  private _medico: string;
  private _exame: string;
  private _cidade_paciente: string;
  private _valor_total: number;


  constructor(
    id: number = 0,
    data: Date = new Date(),
    paciente: string = '',
    medico: string = '',
    exame: string = '',
    cidadePaciente = '',
    valor_total: number = 0
  ) {
    this._codigo_consulta = id;
    this._data = data;
    this._paciente = paciente;
    this._medico = medico;
    this._exame = exame;
    this._cidade_paciente = cidadePaciente;
    this._valor_total = valor_total;
  }


  get codigo_consulta(): number {
    return this._codigo_consulta;
  }

  set codigo_consulta(value: number) {
    this._codigo_consulta = value;
  }

  get data(): Date {
    return this._data;
  }

  set data(value: Date) {
    this._data = value;
  }

  get paciente(): string {
    return this._paciente;
  }

  set paciente(value: string) {
    this._paciente = value;
  }

  get medico(): string {
    return this._medico;
  }

  set medico(value: string) {
    this._medico = value;
  }

  get exame(): string {
    return this._exame;
  }

  set exame(value: string) {
    this._exame = value;
  }


  get cidade_paciente(): string {
    return this._cidade_paciente;
  }

  set cidade_paciente(value: string) {
    this._cidade_paciente = value;
  }


  get valor_total(): number {
    return this._valor_total;
  }

  set valor_total(value: number) {
    this._valor_total = value;
  }
}

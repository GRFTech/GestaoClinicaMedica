export default class ConsultaUI {
  private _id: number;
  private _data: Date;
  private _paciente: string;
  private _medico: string;
  private _exame: string;

  constructor(
    id: number = 0,
    data: Date = new Date(),
    paciente: string = '',
    medico: string = '',
    exame: string = ''
  ) {
    this._id = id;
    this._data = data;
    this._paciente = paciente;
    this._medico = medico;
    this._exame = exame;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
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
}

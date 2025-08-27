export default class Consulta {
  private _id: number;
  private _data: Date;
  private _pacienteId: number;
  private _medicoId: number;
  private _exameId: number;

  constructor(id: number, data: Date, pacienteId: number, medicoId: number, exameId: number) {
    this._id = id;
    this._data = data;
    this._pacienteId = pacienteId;
    this._medicoId = medicoId;
    this._exameId = exameId;
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

  get pacienteId(): number {
    return this._pacienteId;
  }

  set pacienteId(value: number) {
    this._pacienteId = value;
  }

  get medicoId(): number {
    return this._medicoId;
  }

  set medicoId(value: number) {
    this._medicoId = value;
  }

  get exameId(): number {
    return this._exameId;
  }

  set exameId(value: number) {
    this._exameId = value;
  }
}

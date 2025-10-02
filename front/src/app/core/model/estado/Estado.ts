export default class Estado {
  private _id: number;
  private _estado: string;


  constructor(id: number = 0, estado: string = '') {
    this._id = id;
    this._estado = estado;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get estado(): string {
    return this._estado;
  }

  set estado(value: string) {
    this._estado = value;
  }

  toJSON() {
    return {
      id: String(this._id),
      estado: this._estado
    };
  }
}

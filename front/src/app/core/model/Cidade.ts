export default class Cidade {
  private _id: number;
  private _descricao: string;
  private _estadoId: number;


  constructor(id: number, descricao: string, estado: number) {
    this._id = id;
    this._descricao = descricao;
    this._estadoId = estado;
  }


  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get descricao(): string {
    return this._descricao;
  }

  set descricao(value: string) {
    this._descricao = value;
  }

  get estadoId(): number {
    return this._estadoId;
  }

  set estadoId(value: number) {
    this._estadoId = value;
  }
}

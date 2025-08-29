export default class Estado {
  private _id: number;
  private _descricao: string;


  constructor(id: number = 0, descricao: string = '') {
    this._id = id;
    this._descricao = descricao;
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
}

export default class Exame {
  private _id: number;
  private _descricao: string;
  private _valor: number;
  private _especialidadeId: number;


  constructor(id: number, descricao: string, valor: number, especialidadeId: number) {
    this._id = id;
    this._descricao = descricao;
    this._valor = valor;
    this._especialidadeId = especialidadeId;
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

  get valor(): number {
    return this._valor;
  }

  set valor(value: number) {
    this._valor = value;
  }

  get especialidadeId(): number {
    return this._especialidadeId;
  }

  set especialidadeId(value: number) {
    this._especialidadeId = value;
  }
}

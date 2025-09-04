export default class ExameUI {
  private _id: number;
  private _descricao: string;
  private _valor: number;
  private _especialidade: string;


  constructor(
    id: number = 0,
    descricao: string = '',
    valor: number = 0,
    especialidade: string = ''
  ) {
    this._id = id;
    this._descricao = descricao;
    this._valor = valor;
    this._especialidade = especialidade;
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

  get especialidade(): string {
    return this._especialidade;
  }

  set especialidade(value: string) {
    this._especialidade = value;
  }
}

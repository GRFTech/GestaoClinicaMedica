export default class Medico {
  private _id: number;
  private _nome: string;
  private _endereco: string;
  private _telefone: string;
  private _cidadeId: number;
  private _especialidadeId: number;


  constructor(
    id: number = 0,
    nome: string = '',
    endereco: string = '',
    telefone: string = '',
    cidadeId: number = 0,
    especialidadeId: number = 0
  ) {
    this._id = id;
    this._nome = nome;
    this._endereco = endereco;
    this._telefone = telefone;
    this._cidadeId = cidadeId;
    this._especialidadeId = especialidadeId;
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  get nome(): string {
    return this._nome;
  }

  set nome(value: string) {
    this._nome = value;
  }

  get endereco(): string {
    return this._endereco;
  }

  set endereco(value: string) {
    this._endereco = value;
  }

  get telefone(): string {
    return this._telefone;
  }

  set telefone(value: string) {
    this._telefone = value;
  }

  get cidadeId(): number {
    return this._cidadeId;
  }

  set cidadeId(value: number) {
    this._cidadeId = value;
  }

  get especialidadeId(): number {
    return this._especialidadeId;
  }

  set especialidadeId(value: number) {
    this._especialidadeId = value;
  }
}

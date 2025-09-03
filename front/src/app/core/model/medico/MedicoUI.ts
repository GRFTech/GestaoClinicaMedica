export default class MedicoUI {
  private _id: number;
  private _nome: string;
  private _endereco: string;
  private _telefone: string;
  private _cidade: string;
  private _especialidade: string;


  constructor(
    id: number = 0,
    nome: string = '',
    endereco: string = '',
    telefone: string = '',
    cidade: string = '',
    especialidade: string = ''
  ) {
    this._id = id;
    this._nome = nome;
    this._endereco = endereco;
    this._telefone = telefone;
    this._cidade = cidade;
    this._especialidade = especialidade;
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

  get cidade(): string {
    return this._cidade;
  }

  set cidade(value: string) {
    this._cidade = value;
  }

  get especialidade(): string {
    return this._especialidade;
  }

  set especialidade(value: string) {
    this._especialidade = value;
  }
}

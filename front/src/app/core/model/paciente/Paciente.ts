export default class Paciente {
  private _id: number;
  private _nome: string;
  private _dataNascimento: Date;
  private _endereco: string;
  private _telefone: string;
  private _peso: number;
  private _altura: number;
  private _cidadeId: number;

  constructor(
    id: number = 0,
    nome: string = '',
    dataNascimento: Date = new Date(),
    endereco: string = '',
    telefone: string = '',
    peso: number = 0,
    altura: number = 0,
    cidadeId: number = 0
  ) {
    this._id = id;
    this._nome = nome;
    this._dataNascimento = dataNascimento;
    this._endereco = endereco;
    this._telefone = telefone;
    this._peso = peso;
    this._altura = altura;
    this._cidadeId = cidadeId;
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

  get dataNascimento(): Date {
    return this._dataNascimento;
  }

  set dataNascimento(value: Date) {
    this._dataNascimento = value;
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

  get peso(): number {
    return this._peso;
  }

  set peso(value: number) {
    this._peso = value;
  }

  get altura(): number {
    return this._altura;
  }

  set altura(value: number) {
    this._altura = value;
  }

  get cidadeId(): number {
    return this._cidadeId;
  }

  set cidadeId(value: number) {
    this._cidadeId = value;
  }
}

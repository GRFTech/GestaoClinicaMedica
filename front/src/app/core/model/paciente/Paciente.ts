export default class Paciente {
  private _codigo_paciente: number;
  private _nome: string;
  private _dataNascimento: Date;
  private _endereco: string;
  private _telefone: string;
  private _peso: number;
  private _altura: number;
  private _codigo_cidade: number;

  constructor(
    codigo_paciente: number = 0,
    nome: string = '',
    dataNascimento: Date = new Date(),
    endereco: string = '',
    telefone: string = '',
    peso: number = 0,
    altura: number = 0,
    codigo_cidade: number = 0
  ) {
    this._codigo_paciente = codigo_paciente;
    this._nome = nome;
    this._dataNascimento = dataNascimento;
    this._endereco = endereco;
    this._telefone = telefone;
    this._peso = peso;
    this._altura = altura;
    this._codigo_cidade = codigo_cidade;
  }

  get codigo_paciente(): number {
    return this._codigo_paciente;
  }

  set codigo_paciente(value: number) {
    this._codigo_paciente = value;
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

  get codigo_cidade(): number {
    return this._codigo_cidade;
  }

  set codigo_cidade(value: number) {
    this._codigo_cidade = value;
  }


  toJSON() {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const dataStr = `${pad(this._dataNascimento.getDate())}/${pad(this._dataNascimento.getMonth() + 1)}/${this._dataNascimento.getFullYear()}`;

    return {
      codigo_paciente: this._codigo_paciente,
      nome: this._nome,
      data_nascimento: dataStr,
      endereco: this._endereco,
      telefone: this._telefone,
      peso: this._peso,
      altura: this._altura,
      codigo_cidade: this._codigo_cidade
    };
  }
}

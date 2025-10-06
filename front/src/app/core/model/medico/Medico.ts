export default class Medico {
  private _codigo_medico: number;
  private _nome: string;
  private _endereco: string;
  private _telefone: string;
  private _codigo_cidade: number;
  private _codigo_especialidade: number;


  constructor(
    codigo_medico: number = 0,
    nome: string = '',
    endereco: string = '',
    telefone: string = '',
    codigo_cidade: number = 0,
    especialidadeId: number = 0
  ) {
    this._codigo_medico = codigo_medico;
    this._nome = nome;
    this._endereco = endereco;
    this._telefone = telefone;
    this._codigo_cidade = codigo_cidade;
    this._codigo_especialidade = especialidadeId;
  }

  get codigo_medico(): number {
    return this._codigo_medico;
  }

  set codigo_medico(value: number) {
    this._codigo_medico = value;
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

  get codigo_cidade(): number {
    return this._codigo_cidade;
  }

  set codigo_cidade(value: number) {
    this._codigo_cidade = value;
  }

  get codigo_especialidade(): number {
    return this._codigo_especialidade;
  }

  set codigo_especialidade(value: number) {
    this._codigo_especialidade = value;
  }

  toJSON() {
    return {
      codigo_medico: String(this._codigo_medico),
      nome: this._nome,
      endereco: this._endereco,
      telefone: this._telefone,
      codigo_cidade: this._codigo_cidade,
      codigo_especialidade: this._codigo_especialidade
    };
  }
}

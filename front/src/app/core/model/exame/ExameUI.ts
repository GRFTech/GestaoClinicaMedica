export default class ExameUI {
  private _codigo_exame: number;
  private _descricao: string;
  private _valor: number;
  private _especialidade: string;


  constructor(
    codigo_exame: number = 0,
    descricao: string = '',
    valor: number = 0,
    especialidade: string = ''
  ) {
    this._codigo_exame = codigo_exame;
    this._descricao = descricao;
    this._valor = valor;
    this._especialidade = especialidade;
  }


  get codigo_exame(): number {
    return this._codigo_exame;
  }

  set codigo_exame(value: number) {
    this._codigo_exame = value;
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

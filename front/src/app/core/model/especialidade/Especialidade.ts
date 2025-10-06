export default class Especialidade {
  private _codigo_especialidade: number;
  private _descricao: string;
  private _valor_consulta: number;
  private _limite_diario: number;


  constructor(
    codigo_especialidade: number = 0,
    descricao: string = '',
    _valor_consulta: number = 0,
    limite_diario: number = 0
  ) {
    this._codigo_especialidade = codigo_especialidade;
    this._descricao = descricao;
    this._valor_consulta = _valor_consulta;
    this._limite_diario = limite_diario;
  }


  get codigo_especialidade(): number {
    return this._codigo_especialidade;
  }

  set codigo_especialidade(value: number) {
    this._codigo_especialidade = value;
  }

  get descricao(): string {
    return this._descricao;
  }

  set descricao(value: string) {
    this._descricao = value;
  }

  get valor_consulta(): number {
    return this._valor_consulta;
  }

  set valor_consulta(value: number) {
    this._valor_consulta = value;
  }

  get limite_diario(): number {
    return this._limite_diario;
  }

  set limite_diario(value: number) {
    this._limite_diario = value;
  }

  toJSON() {
    return {
      id: this._codigo_especialidade,
      descricao: this._descricao,
      valorConsulta: this._valor_consulta,
      limite_diario: this._limite_diario
    };
  }
}

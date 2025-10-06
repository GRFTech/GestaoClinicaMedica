export default class Exame {
  private _codigo_exame: number;
  private _descricao: string;
  private _valor_exame: number;
  private _codigo_especialidade: number;


  constructor(
    codigo_exame: number = 0,
    descricao: string = '',
    valor_exame: number = 0,
    codigo_especialidade: number = 0
  ) {
    this._codigo_exame = codigo_exame;
    this._descricao = descricao;
    this._valor_exame = valor_exame;
    this._codigo_especialidade = codigo_especialidade;
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

  get valor_exame(): number {
    return this._valor_exame;
  }

  set valor_exame(value: number) {
    this._valor_exame = value;
  }

  get codigo_especialidade(): number {
    return this._codigo_especialidade;
  }

  set codigo_especialidade(value: number) {
    this._codigo_especialidade = value;
  }

  toJSON() {
    return {
      codigo_exame: String(this._codigo_exame),
      descricao: this._descricao,
      valor_exame: this._valor_exame,
      codigo_especialidade: this._codigo_especialidade
    };
  }
}

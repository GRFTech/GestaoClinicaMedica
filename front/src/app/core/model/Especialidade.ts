export default class Especialidade {
  private _id: number;
  private _descricao: string;
  private _valorConsulta: number;
  private _limiteDiario: number;


  constructor(id: number, descricao: string, valorConsulta: number, limiteDiario: number) {
    this._id = id;
    this._descricao = descricao;
    this._valorConsulta = valorConsulta;
    this._limiteDiario = limiteDiario;
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

  get valorConsulta(): number {
    return this._valorConsulta;
  }

  set valorConsulta(value: number) {
    this._valorConsulta = value;
  }

  get limiteDiario(): number {
    return this._limiteDiario;
  }

  set limiteDiario(value: number) {
    this._limiteDiario = value;
  }
}

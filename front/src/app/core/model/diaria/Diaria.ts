export default class Diaria {
  private _codigoDia: Date;
  private _quantidadeConsultas: number;
  private _especialidadeId: number;


  formatarDataAAAAMMDD(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}${mes}${dia}`;
  }

  constructor(
    codigoDia: Date = new Date(),
    quantidadeConsultas: number = 0,
    especialidadeId: number = 0
  ) {
    this._codigoDia = codigoDia;
    this._quantidadeConsultas = quantidadeConsultas;
    this._especialidadeId = especialidadeId;
  }


  get codigoDia(): Date {
    return this._codigoDia;
  }

  set codigoDia(value: Date) {
    this._codigoDia = value;
  }

  get quantidadeConsultas(): number {
    return this._quantidadeConsultas;
  }

  set quantidadeConsultas(value: number) {
    this._quantidadeConsultas = value;
  }

  get especialidadeId(): number {
    return this._especialidadeId;
  }

  set especialidadeId(value: number) {
    this._especialidadeId = value;
  }

  toJSON() {
    return {
      codigoDia: this.formatarDataAAAAMMDD(this._codigoDia),
      quantidadeConsultas: this._quantidadeConsultas,
      especialidadeId: this._especialidadeId
    };
  }
}

export default class DiariaUI {
  private _codigoDia: Date;
  private _codigoDiaString: string;
  private _quantidadeConsultas: number;
  private _especialidade: string;

  // Converte de Date para o formato AAAAMMDD
  formatarDataAAAAMMDD(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}${mes}${dia}`;
  }

  // Converte de AAAAMMDD para Date
  parseDataStringToDate(codigoDiaString: string): Date {
    const ano = parseInt(codigoDiaString.substring(0, 4), 10);
    const mes = parseInt(codigoDiaString.substring(4, 6), 10) - 1;
    const dia = parseInt(codigoDiaString.substring(6, 8), 10);
    return new Date(ano, mes, dia);
  }

  constructor(
    codigoDia: Date = new Date(),
    codigoDiaString: string = "",
    quantidadeConsultas: number = 0,
    especialidade: string = ""
  ) {
    this._codigoDia = codigoDia;
    this._codigoDiaString = codigoDiaString;
    if (codigoDiaString) {
      this._codigoDia = this.parseDataStringToDate(codigoDiaString);
    } else {
      this._codigoDiaString = this.formatarDataAAAAMMDD(codigoDia);
    }
    this._quantidadeConsultas = quantidadeConsultas;
    this._especialidade = especialidade;
  }

  get codigoDia(): Date {
    return this._codigoDia;
  }

  set codigoDia(value: Date) {
    this._codigoDia = value;
    this._codigoDiaString = this.formatarDataAAAAMMDD(value);
  }

  get codigoDiaString(): string {
    return this._codigoDiaString;
  }

  set codigoDiaString(value: string) {
    this._codigoDiaString = value;
    this._codigoDia = this.parseDataStringToDate(value);
  }

  get quantidadeConsultas(): number {
    return this._quantidadeConsultas;
  }

  set quantidadeConsultas(value: number) {
    this._quantidadeConsultas = value;
  }

  get especialidade(): string {
    return this._especialidade;
  }

  set especialidade(value: string) {
    this._especialidade = value;
  }
}

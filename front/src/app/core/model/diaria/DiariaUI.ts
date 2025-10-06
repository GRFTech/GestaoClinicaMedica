export default class DiariaUI {
  private _codigoDia: Date;
  private _codigoDiaString: string; // AAAAMMDD
  private _quantidadeConsultas: number;
  private _especialidade: string;

  constructor(
    codigoDia: Date = new Date(),
    codigoDiaString: string = '',
    quantidadeConsultas: number = 0,
    especialidade: string = ''
  ) {
    // Se vier a string AAAAMMDD, converte para Date; senão, usa a Date passada e gera a string.
    if (codigoDiaString) {
      this._codigoDiaString = codigoDiaString;
      this._codigoDia = this.parseAAAAMMDDToDate(codigoDiaString);
    } else {
      this._codigoDia = codigoDia;
      this._codigoDiaString = this.formatarDataAAAAMMDD(codigoDia);
    }
    this._quantidadeConsultas = quantidadeConsultas;
    this._especialidade = especialidade;
  }

  // --- utilitários ---
  formatarDataAAAAMMDD(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}${mes}${dia}`;
  }

  parseAAAAMMDDToDate(codigoDiaString: string): Date {
    if (!codigoDiaString || codigoDiaString.length < 8) return new Date();
    const ano = parseInt(codigoDiaString.substring(0, 4), 10);
    const mes = parseInt(codigoDiaString.substring(4, 6), 10) - 1;
    const dia = parseInt(codigoDiaString.substring(6, 8), 10);
    return new Date(ano, mes, dia);
  }

  // --- getters / setters ---
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
    this._codigoDia = this.parseAAAAMMDDToDate(value);
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

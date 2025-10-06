export default class Diaria {
  // Representa o formato usado pelo backend:
  // { codigo_dia: 20251006, codigo_especialidade: 1, quantidade_consultas: 5 }
  codigo_dia: number; // AAAAMMDD como número
  codigo_especialidade: number;
  quantidade_consultas: number;

  constructor(codigo_dia: number = 0, codigo_especialidade: number = 0, quantidade_consultas: number = 0) {
    this.codigo_dia = codigo_dia;
    this.codigo_especialidade = codigo_especialidade;
    this.quantidade_consultas = quantidade_consultas;
  }

  static fromJSON(obj: any): Diaria {
    if (!obj) return new Diaria(0, 0, 0);
    // Aceita campos em snake_case (backend) ou camelCase (por segurança)
    const codigo_dia = obj.codigo_dia ?? obj.codigoDia ?? obj.codigoDiaString ?? 0;
    const codigo_especialidade = obj.codigo_especialidade ?? obj.especialidadeId ?? obj.codigo_especialidade ?? 0;
    const quantidade_consultas = obj.quantidade_consultas ?? obj.quantidadeConsultas ?? 0;
    return new Diaria(Number(codigo_dia), Number(codigo_especialidade), Number(quantidade_consultas));
  }

  toJSON(): any {
    // Formato que o backend espera (snake_case)
    return {
      codigo_dia: Number(this.codigo_dia),
      codigo_especialidade: Number(this.codigo_especialidade),
      quantidade_consultas: Number(this.quantidade_consultas)
    };
  }
}

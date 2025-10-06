import {AbstractDataType} from '../../interfaces/abstract-data-type';

export class CidadeUI implements AbstractDataType {
  codigo: number;
  descricao: string;
  estado: string;

  constructor(id: number = 0, descricao: string = '', estado: string = '') {
    this.codigo = id;
    this.descricao = descricao;
    this.estado = estado;
  }
}

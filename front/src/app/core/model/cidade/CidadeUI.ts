import {AbstractDataType} from '../../interfaces/abstract-data-type';

export class CidadeUI implements AbstractDataType {
  id: number;
  descricao: string;
  estado: string;

  constructor(id: number = 0, descricao: string = '', estado: string = '') {
    this.id = id;
    this.descricao = descricao;
    this.estado = estado;
  }
}

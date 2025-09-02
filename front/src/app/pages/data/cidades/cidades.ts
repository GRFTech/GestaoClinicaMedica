import {Component, OnInit} from '@angular/core';
import {CidadeService} from '../../../core/services/cidade-service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableColumn} from '../../../core/interfaces/table-column';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import {EstadoService} from '../../../core/services/estado-service';
import Cidade from '../../../core/model/cidade/Cidade';
import {CidadeUI} from '../../../core/model/cidade/CidadeUI';

@Component({
  selector: 'app-cidades',
  imports: [
    DynamicCrud
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cidades.html',
  standalone: true,
  styleUrl: './cidades.scss'
})
export class Cidades implements OnInit {

  constructor(
    private cidadeService: CidadeService,
    private estadoService: EstadoService
  ) {}

  cols!: TableColumn[];
  data!: CidadeUI[];
  entityName = "Cidade";
  title = "Gerenciar Cidades";
  t_class = CidadeUI;

  estadoOptions() {
    return this.estadoService.getEstados()().map(e => ({
      label: e.estado,
      value: e.estado
    }));
  }

  private mapToUI(cidades: Cidade[]): CidadeUI[] {
    const estados = this.estadoService.getEstados()();
    return cidades.map(c => {
      const estado = estados.find(e => e.id === c.estadoId);
      return new CidadeUI(
        c.id,
        c.descricao,
        estado ? estado.estado : ''
      );
    });
  }

  ngOnInit(): void {
    const cidadesDto = this.cidadeService.getCidades()();
    this.data = this.mapToUI(cidadesDto);

    this.cols = [
      { field: 'id', header: 'ID', editable: false, type: 'number', insertable: false },
      { field: 'descricao', header: 'Descrição', editable: false, type: 'text', insertable: true },
      { field: 'estado', header: 'Estado', editable: false, type: 'select', insertable: true, options: this.estadoOptions() },
    ];
  }
}

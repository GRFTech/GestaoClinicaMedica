import {Component, computed, OnInit, ViewChild} from '@angular/core';
import {Table} from 'primeng/table';
import Cidade from '../../../core/model/Cidade';
import {CidadeService} from '../../../core/services/cidade-service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableColumn} from '../../../core/interfaces/table-column';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import {EstadoService} from '../../../core/services/estado-service';

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

  constructor(private cidadeService: CidadeService, private estadoService: EstadoService) {
  }

  cols!: TableColumn[];

  data!: Cidade[];

  entityName = "Cidade";

  title = "Gerenciar Cidades"

  t_class = Cidade

  estadoOptions() {
    let c = this.estadoService.getEstados()().map(e => ({
      label: e.descricao,
      value: e.id
    }));

    return c
  }

  ngOnInit(): void {

    this.data = this.cidadeService.getCidades()();



    this.cols = [
      { field: 'id', header: 'ID', editable: false, type: 'number' },
      { field: 'descricao', header: 'Descrição', editable: true, type: 'string' },
      { field: 'estadoId', header: 'Estado', editable: true, type: 'select', options: this.estadoOptions()},
    ];
  }

}

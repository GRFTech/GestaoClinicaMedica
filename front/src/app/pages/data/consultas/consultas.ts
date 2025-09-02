import {Component, OnInit} from '@angular/core';
import {CidadeService} from '../../../core/services/cidade-service';
import {TableColumn} from '../../../core/interfaces/table-column';
import Consulta from '../../../core/model/Consulta';
import {ConsultaService} from '../../../core/services/consulta-service';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';

@Component({
  selector: 'app-consultas',
  imports: [
    DynamicCrud
  ],
  templateUrl: './consultas.html',
  standalone: true,
  styleUrl: './consultas.scss'
})
export class Consultas implements OnInit {

  constructor(private consultaService: ConsultaService) {
  }

  cols!: TableColumn[];

  data!: Consulta[];

  entityName = "Consultas";

  title = "Gerenciar Consultas"

  t_class = Consulta

  ngOnInit(): void {

    this.data = this.consultaService.getConsultas()();

    this.cols = [
      { field: 'id', header: 'ID', editable: false, type: 'number', insertable: false },
      { field: 'data', header: 'Data', editable: true, type: 'datetime', insertable: true },
      { field: 'pacienteId', header: 'ID do Paciente', editable: false, type: 'number', insertable: true },
      { field: 'medicoId', header: 'ID do Medico', editable: false, type: 'number', insertable: true },
      { field: 'exameId', header: 'ID do Exame', editable: false, type: 'number', insertable: true }
    ];
  }
}

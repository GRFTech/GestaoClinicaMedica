import {Component, inject, OnInit, signal} from '@angular/core';
import {TableColumn} from '../../../core/interfaces/table-column';
import {ConsultaService} from '../../../core/services/consulta-service';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import ConsultaUI from '../../../core/model/consulta/ConsultaUI';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {PacienteService} from '../../../core/services/paciente-service';
import {MedicoService} from '../../../core/services/medico-service';
import {ExameService} from '../../../core/services/exame-service';

@Component({
  selector: 'app-consulta',
  imports: [
    DynamicCrud,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './consultas.html',
  standalone: true,
  styleUrl: './consultas.scss'
})
export class Consultas implements OnInit {

  consultaService = inject(ConsultaService);
  messageService = inject(MessageService);
  pacienteService = inject(PacienteService);
  medicoService = inject(MedicoService);
  exameService = inject(ExameService);

  constructor() {}

  cols!: TableColumn[];

  entityName = "Consultas";

  title = "Gerenciar Consultas"

  t_class = ConsultaUI

  ngOnInit(): void {

    this.cols = [
      { field: 'id', header: 'ID', editable: false, type: 'number', insertable: false },
      { field: 'data', header: 'Data', editable: true, type: 'datetime', insertable: true },
      { field: 'paciente', header: 'Paciente', editable: false, type: 'select', insertable: true, options: this.pacienteOptions() },
      { field: 'medico', header: 'Medico', editable: false, type: 'select', insertable: true, options: this.medicoOptions() },
      { field: 'exame', header: 'Exame', editable: false, type: 'select', insertable: true, options: this.exameOptions() }
    ];
  }
  onSave(ui: ConsultaUI) {
    this.consultaService.createConsulta(ui);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Consulta salva com sucesso!`,
      life: 3000
    });
  }

  onEdit(ui: ConsultaUI) {
    this.consultaService.updateConsulta(ui);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Consulta atualizada com sucesso!`,
      life: 3000
    });
  }

  onDelete(ui: ConsultaUI) {
    this.consultaService.deleteConsulta(ui);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Consulta removida com sucesso!`,
      life: 3000
    });
  }

  onDeleteSelected(uis: ConsultaUI[]) {
    this.consultaService.deleteConsultas(uis);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `${uis.length} consulta(s) removida(s) com sucesso!`,
      life: 3000
    });
  }

  pacienteOptions() {
    return this.pacienteService.getPacientes()().map(p => ({
      label: p.nome,
      value: p.nome
    }));
  }

  medicoOptions() {
    return this.medicoService.getMedicos()().map(m => ({
      label: m.nome,
      value: m.nome
    }));
  }

  exameOptions() {
    return this.exameService.getExames()().map(e => ({
      label: e.descricao,
      value: e.descricao
    }));
  }

}

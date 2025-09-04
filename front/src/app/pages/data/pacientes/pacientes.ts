import {Component, inject, OnInit} from '@angular/core';
import {PacienteService} from '../../../core/services/paciente-service';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import {TableColumn} from '../../../core/interfaces/table-column';
import PacienteUI from '../../../core/model/paciente/PacienteUI';
import {CidadeService} from '../../../core/services/cidade-service';

@Component({
  selector: 'app-pacientes',
  imports: [
    Toast,
    DynamicCrud
  ],
  providers: [MessageService],
  templateUrl: './pacientes.html',
  standalone: true,
  styleUrl: './pacientes.scss'
})
export class Pacientes implements OnInit {

  pacienteService = inject(PacienteService);
  messageService = inject(MessageService);
  cidadeService = inject(CidadeService)

  constructor() {
  }


  ngOnInit(): void {

    this.cols = [
      { field: 'id', header: 'ID', editable: false, type: 'number', insertable: false, exhibitable: true },
      { field: 'nome', header: 'Nome', editable: true, type: 'text', insertable: true, exhibitable: true },
      { field: 'dataNascimento', header: 'Data de Nascimento', editable: false, type: 'date', insertable: true, exhibitable: true },
      { field: 'endereco', header: 'Endereço', editable: true, type: 'text', insertable: true, exhibitable: true },
      { field: 'telefone', header: 'Telefone', editable: true, type: 'text', insertable: true, exhibitable: true },
      { field: 'peso', header: 'Peso (kg)', editable: true, type: 'number', insertable: true, exhibitable: true },
      { field: 'altura', header: 'Altura (cm)', editable: true, type: 'number', insertable: true, exhibitable: true },
      { field: 'cidade', header: 'Cidade', editable: true, type: 'select', insertable: true, options: this.cidadeOptions(), exhibitable: true }
    ];
  }

  cols!: TableColumn[];

  entityName = "Pacientes";

  title = "Gerenciar Pacientes"

  t_class = PacienteUI

  onSave(ui: PacienteUI) {
    try {
      this.pacienteService.createPaciente(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Paciente salvo com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao salvar o paciente!`,
        life: 3000
      });
    }
  }

  onEdit(ui: PacienteUI) {
    try {
      this.pacienteService.updatePaciente(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Paciente atualizado com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao atualizar o paciente!`,
        life: 3000
      });
    }
  }

  onDelete(ui: PacienteUI) {
    try {
      this.pacienteService.deletePaciente(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Paciente removido com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao deletar o paciente!`,
        life: 3000
      });
    }
  }

  onDeleteSelected(uis: PacienteUI[]) {
   try {
     this.pacienteService.deletePacientes(uis);
     this.messageService.add({
       severity: 'success',
       summary: 'Sucesso',
       detail: `${uis.length} paciente(s) removido(s) com sucesso!`,
       life: 3000
     });
   } catch (ex) {
     this.messageService.add({
       severity: 'error',
       summary: 'Ocorreu um erro!',
       detail: `Ocorreu um erro ao deletar o(s) ${uis.length} paciente(s)!`,
       life: 3000
     });
   }
  }

  cidadeOptions() {
    return this.cidadeService.cidadesDto().map(c => ({
      label: c.descricao,
      value: c.descricao
    }));
  }




}

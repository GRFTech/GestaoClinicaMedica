import {Component, inject, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {TableColumn} from '../../../core/interfaces/table-column';
import MedicoUI from '../../../core/model/medico/MedicoUI';
import {MedicoService} from '../../../core/services/medico-service';
import {CidadeService} from '../../../core/services/cidade-service';
import {EspecialidadeService} from '../../../core/services/especialidade-service';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-medicos',
  imports: [
    DynamicCrud,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './medicos.html',
  standalone: true,
  styleUrl: './medicos.scss'
})
export class Medicos implements OnInit {

  messageService = inject(MessageService);
  medicoService = inject(MedicoService);
  cidadeService = inject(CidadeService);
  especialidadeService = inject(EspecialidadeService);

  constructor() {}

  cols!: TableColumn[];

  entityName = "Medico";

  title = "Gerenciar Medicos"

  t_class = MedicoUI

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID', editable: false, type: 'number', insertable: false },
      { field: 'nome', header: 'Nome', editable: true, type: 'text', insertable: true },
      { field: 'endereco', header: 'Endereço', editable: true, type: 'text', insertable: true },
      { field: 'telefone', header: 'Telefone', editable: true, type: 'text', insertable: true },
      { field: 'cidade', header: 'Cidade', editable: true, type: 'select', insertable: true, options: this.cidadeOptions() },
      { field: 'especialidade', header: 'Especialidade', editable: true, type: 'select', insertable: true, options: this.especialidadeOptions() }
    ];
  }
  onSave(ui: MedicoUI) {

    try {
      this.medicoService.createMedico(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Medico salvo com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao salvar o medico!`,
        life: 3000
      });
    }
  }

  onEdit(ui: MedicoUI) {
    try {
      this.medicoService.updateMedico(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Medico atualizado com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao editar o medico!`,
        life: 3000
      });
    }
  }

  onDelete(ui: MedicoUI) {

    try {
      this.medicoService.deleteMedico(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Medico removido com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao deletar o medico!`,
        life: 3000
      });
    }
  }

  onDeleteSelected(uis: MedicoUI[]) {
    try {
      this.medicoService.deleteMedicos(uis);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${uis.length} medico(s) removido(s) com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar deletar ${uis.length} medico(s)!`,
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

  especialidadeOptions() {
    return this.especialidadeService.especialidadesDto().map(e => ({
      label: e.descricao,
      value: e.descricao
    }));
  }


}

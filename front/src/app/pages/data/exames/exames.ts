import {Component, inject, OnInit} from '@angular/core';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import {Toast} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {TableColumn} from '../../../core/interfaces/table-column';
import ExameUI from '../../../core/model/exame/ExameUI';
import {EspecialidadeService} from '../../../core/services/especialidade-service';
import {ExameService} from '../../../core/services/exame-service';

@Component({
  selector: 'app-exames',
  imports: [
    DynamicCrud,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './exames.html',
  standalone: true,
  styleUrl: './exames.scss'
})
export class Exames implements OnInit {

  messageService = inject(MessageService);
  especialidadeService = inject(EspecialidadeService)
  exameService = inject(ExameService);

  constructor() {}

  cols!: TableColumn[];

  entityName = "Exame";

  title = "Gerenciar Exames"

  t_class = ExameUI

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID', editable: false, type: 'number', insertable: false, exhibitable: true },
      { field: 'descricao', header: 'Descrição', editable: true, type: 'text', insertable: true, exhibitable: true },
      { field: 'valor', header: 'Valor', editable: true, type: 'currency', insertable: true, exhibitable: true },
      { field: 'especialidade', header: 'Especialidade', editable: true, type: 'select', insertable: true, options: this.especialidadeOptions(), exhibitable: true }
    ];
  }
  onSave(ui: ExameUI) {

    try {
      this.exameService.createExame(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Exame salvo com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao salvar o exame!`,
        life: 3000
      });
    }
  }

  onEdit(ui: ExameUI) {
    try {
      this.exameService.updateExame(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Exame atualizado com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao editar o exame!`,
        life: 3000
      });
    }
  }

  onDelete(ui: ExameUI) {

    try {
      this.exameService.deleteExame(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Exame removido com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao deletar o exame!`,
        life: 3000
      });
    }
  }

  onDeleteSelected(uis: ExameUI[]) {
    try {
      this.exameService.deleteExames(uis);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${uis.length} exame(s) removido(s) com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar deletar ${uis.length} exame(s)!`,
        life: 3000
      });
    }
  }

  especialidadeOptions() {
    return this.especialidadeService.especialidadesDto().map(e => ({
      label: e.descricao,
      value: e.descricao
    }));
  }


}

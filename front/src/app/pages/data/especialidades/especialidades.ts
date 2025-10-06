import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicCrud } from '../../../core/components/dynamic-crud/dynamic-crud';
import { Toast } from 'primeng/toast';
import { TableColumn } from '../../../core/interfaces/table-column';
import Especialidade from '../../../core/model/especialidade/Especialidade';
import { EspecialidadeService } from '../../../core/services/especialidade-service';

@Component({
  selector: 'app-especialidades',
  imports: [
    DynamicCrud,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './especialidades.html',
  standalone: true,
  styleUrl: './especialidades.scss'
})
export class Especialidades implements OnInit {

  especialidadeService = inject(EspecialidadeService);
  messageService = inject(MessageService);

  cols!: TableColumn[];

  entityName = "Especialidade";

  title = "Gerenciar Especialidades";

  t_class = Especialidade;

  ngOnInit(): void {
    this.cols = [
      { field: 'codigo_especialidade', header: 'Código da Especialidade', editable: true, type: 'number', insertable: true, exhibitable: true },
      { field: 'descricao', header: 'Descrição', editable: true, type: 'text', insertable: true, exhibitable: true },
      { field: 'valor_consulta', header: 'Valor da Consulta', editable: true, type: 'currency', insertable: true, exhibitable: true },
      { field: 'limite_diario', header: 'Limite Diario', editable: true, type: 'number', insertable: true, exhibitable: true },
    ];
  }

  onSave(ui: Especialidade) {
    try {
      this.especialidadeService.createEspecialidade(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Especialidade salva com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao salvar a especialidade!`,
        life: 3000
      });
    }
  }

  onEdit(ui: Especialidade) {
    try {
      this.especialidadeService.updateEspecialidade(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Especialidade atualizada com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao editar a especialidade!`,
        life: 3000
      });
    }
  }

  onDelete(ui: Especialidade) {
    try {
      this.especialidadeService.deleteEspecialidade(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Especialidade removida com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao deletar a especialidade!`,
        life: 3000
      });
    }
  }

  onDeleteSelected(uis: Especialidade[]) {
    try {
      this.especialidadeService.deleteEspecialidades(uis);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${uis.length} especialidade(s) removida(s) com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar deletar ${uis.length} especialidade(s)!`,
        life: 3000
      });
    }
  }
}

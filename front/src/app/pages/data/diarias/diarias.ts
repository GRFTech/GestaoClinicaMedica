import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicCrud } from '../../../core/components/dynamic-crud/dynamic-crud';
import { Toast } from 'primeng/toast';
import { TableColumn } from '../../../core/interfaces/table-column';
import { DiariaService } from '../../../core/services/diaria-service';
import { EspecialidadeService } from '../../../core/services/especialidade-service';
import DiariaUI from '../../../core/model/diaria/DiariaUI';

@Component({
  selector: 'app-diaria',
  imports: [
    DynamicCrud,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './diarias.html',
  standalone: true,
  styleUrls: ['./diarias.scss']
})
export class Diarias implements OnInit {

  diariaService = inject(DiariaService);
  messageService = inject(MessageService);
  especialidadeService = inject(EspecialidadeService);

  cols!: TableColumn[];

  entityName = "Diária";
  title = "Gerenciar Diárias";
  t_class = DiariaUI;

  ngOnInit(): void {
    this.cols = [
      { field: 'codigoDiaString', header: 'Código do Dia', editable: false, type: 'text', insertable: false, exhibitable: true },
      { field: 'codigoDia', header: 'Data', editable: false, type: 'date', insertable: true, exhibitable: false },
      { field: 'quantidadeConsultas', header: 'Quantidade de Consultas', editable: true, type: 'number', insertable: true, exhibitable: true },
      { field: 'especialidade', header: 'Especialidade', editable: false, type: 'select', insertable: true, options: this.getEspecialidadeOptions(), exhibitable: true },
    ];
  }

  onSave(diaria: DiariaUI): void {
    try {
      this.diariaService.createDiaria(diaria);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Diária salva com sucesso!',
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Ocorreu um erro ao salvar a diária!',
        life: 3000
      });
    }
  }

  onEdit(diaria: DiariaUI): void {
    try {
      this.diariaService.updateDiaria(diaria);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Diária atualizada com sucesso!',
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Ocorreu um erro ao editar a diária!',
        life: 3000
      });
    }
  }

  onDelete(diaria: DiariaUI): void {
    try {
      this.diariaService.deleteDiaria(diaria);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: 'Diária removida com sucesso!',
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Ocorreu um erro ao deletar a diária!',
        life: 3000
      });
    }
  }

  onDeleteSelected(diarias: DiariaUI[]): void {
    try {
      this.diariaService.deleteDiarias(diarias);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${diarias.length} diária(s) removida(s) com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: `Ocorreu um erro ao deletar as diárias selecionadas!`,
        life: 3000
      });
    }
  }

  getEspecialidadeOptions() {
    return this.especialidadeService.especialidadesDto().map(especialidade => ({
      label: especialidade.descricao,
      value: especialidade.descricao
    }));
  }
}

import {Component, inject, OnInit, signal} from '@angular/core';
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

  especialidadeOptions = signal<{ label: string, value: string }[]>([]);


  async ngOnInit() {
    const especialidades = await this.especialidadeService.getEspecialidades();

    this.especialidadeOptions.set(especialidades.map(e => ({
      label: e.descricao,
      value: e.descricao
    })));


    this.cols = [
      { field: 'codigoDiaString', header: 'Código do Dia', editable: true, type: 'text', insertable: false, exhibitable: true },
      { field: 'codigoDia', header: 'Data', editable: true, type: 'date', insertable: true, exhibitable: false },
      { field: 'quantidadeConsultas', header: 'Quantidade de Consultas', editable: true, type: 'number', insertable: true, exhibitable: true },
      { field: 'especialidade', header: 'Especialidade', editable: true, type: 'select', insertable: true, options: this.especialidadeOptions(), exhibitable: true },
    ];
  }

  onSave(diaria: DiariaUI): void {
    this.diariaService.createDiaria(diaria).subscribe({
      next: res => {

        this.diariaService.diarias.update(list => [...list, this.diariaService.UItoDto(diaria)]);

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: res.mensagem ?? 'Diária salva com sucesso!',
          life: 3000
        });
      },
      error: err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.message,
          life: 4000
        });
      }
    });
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
}

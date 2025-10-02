import {Component, inject, OnInit} from '@angular/core';
import {MessageService} from 'primeng/api';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import {Toast} from 'primeng/toast';
import {TableColumn} from '../../../core/interfaces/table-column';
import {EstadoService} from '../../../core/services/estado-service';
import Estado from '../../../core/model/estado/Estado';

@Component({
  selector: 'app-estados',
  imports: [
    DynamicCrud,
    Toast
  ],
  providers: [MessageService],
  templateUrl: './estados.html',
  standalone: true,
  styleUrl: './estados.scss'
})
export class Estados implements OnInit {

  estadoService = inject(EstadoService);
  messageService = inject(MessageService);

  constructor() {}

  cols!: TableColumn[];

  entityName = "Estado";

  title = "Gerenciar Estados";

  t_class = Estado;

  ngOnInit(): void {
    this.cols = [
      { field: 'id', header: 'ID', editable: true, type: 'number', insertable: true, exhibitable: true },
      { field: 'estado', header: 'Estado', editable: true, type: 'text', insertable: true, exhibitable: true },
    ];
  }

  onSave(e: Estado) {
    try {
      this.estadoService.createEstado(e);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Estado salvo com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao salvar o estado!`,
        life: 3000
      });
    }
  }

  onEdit(e: Estado) {
    try {
      this.estadoService.updateEstado(e);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Estado atualizado com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao editar o estado!`,
        life: 3000
      });
    }
  }

  onDelete(e: Estado) {
    try {
      this.estadoService.deleteEstado(e);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Estado removido com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao deletar o estado!`,
        life: 3000
      });
    }
  }

  onDeleteSelected(es: Estado[]) {
    try {
      this.estadoService.deleteEstados(es);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${es.length} estado(s) removido(s) com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar deletar ${es.length} estado(s)!`,
        life: 3000
      });
    }
  }

}

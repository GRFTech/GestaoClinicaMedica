import {Component, Output, Input, EventEmitter, ViewChild, OnInit} from '@angular/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {Table, TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {Toolbar} from 'primeng/toolbar';
import {Toast} from 'primeng/toast';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {Dialog} from 'primeng/dialog';
import {FormsModule} from '@angular/forms';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {TableColumn} from '../../interfaces/table-column';
import {InputText} from 'primeng/inputtext';
import {AbstractDataType} from '../../interfaces/abstract-data-type';

@Component({
  selector: 'app-dynamic-crud',
  providers: [ConfirmationService, MessageService],
  imports: [
    Button,
    Toolbar,
    Toast,
    TableModule,
    IconField,
    InputIcon,
    Dialog,
    FormsModule,
    ConfirmDialog,
    InputText
  ],
  templateUrl: './dynamic-crud.html',
  standalone: true,
  styleUrl: './dynamic-crud.scss'
})
export class DynamicCrud<T extends AbstractDataType> implements OnInit {
  @Input() title: string = 'Gerenciar Dados';
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() entityName: string = 'item';

  @Output() onSave = new EventEmitter<T>();
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>();
  @Output() onDeleteSelected = new EventEmitter<T[]>();

  @ViewChild('dt') dt!: Table;

  dialogVisible: boolean = false;
  selectedItems: T[] = [];
  currentItem!: T;
  submitted: boolean = false;
  globalFilterFields!: string[];

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.currentItem = this.data[0];
  }

  openNew() {
    this.submitted = false;
    this.dialogVisible = true;
  }

  edit(item: T) {
    this.currentItem = { ...item };
    this.dialogVisible = true;
  }

  confirmDelete(item: T) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar este ${this.entityName}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDelete.emit(item);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `${this.entityName} deletado com sucesso!`,
          life: 3000
        });
      }
    });
  }

  confirmDeleteSelected() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar os/as ${this.entityName}s selecionados?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      rejectButtonProps: {
        label: 'Não',
        severity: 'secondary',
        variant: 'text'
      },
      acceptButtonProps: {
        severity: 'danger',
        label: 'Sim'
      },
      accept: () => {
        this.onDeleteSelected.emit(this.selectedItems);
        this.selectedItems = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Dados deletados com sucesso!`,
          life: 3000
        });
      }
    });
  }

  save() {
    this.submitted = true;
    this.onSave.emit(this.currentItem);
    this.dialogVisible = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: `Dados salvos com sucesso!`,
      life: 3000
    });
  }

  exportCSV() {
    this.dt.exportCSV();
  }
}

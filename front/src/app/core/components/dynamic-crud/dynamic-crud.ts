import {Component, Output, Input, EventEmitter, ViewChild, OnInit, signal, input, Signal} from '@angular/core';
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
import {CrudField} from '../crud-field/crud-field';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {Tag} from 'primeng/tag';

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
    InputText,
    CrudField,
    DatePipe,
    CurrencyPipe,
    Tag
  ],
  templateUrl: './dynamic-crud.html',
  standalone: true,
  styleUrl: './dynamic-crud.scss'
})
export class DynamicCrud<T extends AbstractDataType> implements OnInit {
  @Input() title: string = 'Gerenciar Dados';
  @Input() columns: TableColumn[] = [];
  @Input({ required: true }) data!: Signal<T[]>;
  @Input() entityName: string = 'item';
  @Input() T_class!: { new(): T };

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
  isEdit!: boolean;
  message!: string;

  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.currentItem = this.data()[0];
  }

  openNew() {
    this.isEdit = false;
    this.currentItem = new this.T_class()
    this.submitted = false;
    this.message = "Registrar novo item"
    this.dialogVisible = true;
  }

  edit(item: T) {
    this.isEdit = true;
    this.message = "Editar"
    this.currentItem = Object.create(item);
    this.dialogVisible = true;
  }

  confirmDelete(item: T) {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar o item ${this.entityName}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onDelete.emit(item);
      }
    });
  }

  confirmDeleteSelected() {
    this.confirmationService.confirm({
      message: `Tem certeza que deseja deletar os itens selecionados?`,
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
      }
    });
  }

  save() {
    this.submitted = true;
    this.dialogVisible = false;
    this.onSave.emit(this.currentItem);
  }

  exportCSV() {
    this.dt.exportCSV();
  }
}

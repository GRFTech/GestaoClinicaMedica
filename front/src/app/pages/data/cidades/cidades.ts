import {Component, inject, OnInit, signal, Signal} from '@angular/core';
import {CidadeService} from '../../../core/services/cidade-service';
import {ConfirmationService, MessageService} from 'primeng/api';
import {TableColumn} from '../../../core/interfaces/table-column';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import {CidadeUI} from '../../../core/model/cidade/CidadeUI';
import {Toast} from 'primeng/toast';

@Component({
  selector: 'app-cidades',
  imports: [
    DynamicCrud,
    Toast
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './cidades.html',
  standalone: true,
  styleUrl: './cidades.scss'
})
export class Cidades implements OnInit {

  cols!: TableColumn[];
  entityName = "Cidade";
  title = "Gerenciar Cidades";
  t_class = CidadeUI;

  cidadeService = inject(CidadeService)

  constructor(private messageService: MessageService) {}


  async ngOnInit() {
    // 🔹 Configura as colunas
    this.cols = [
      { field: 'codigo', header: 'Código', editable: false, type: 'number', insertable: false, exhibitable: true },
      { field: 'descricao', header: 'Descrição', editable: true, type: 'text', insertable: true, exhibitable: true },
      { field: 'estado', header: 'Estado', editable: false, type: 'text', insertable: true, exhibitable: true },
    ];
  }

  onSave(cidadeUI: CidadeUI) {
    try {
      this.cidadeService.createCidade(cidadeUI);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Cidade salva com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar salvar a cidade!`,
        life: 3000
      });
    }
  }

  onEdit(cidadeUI: CidadeUI) {
    try {
      this.cidadeService.updateCidade(cidadeUI);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Cidade atualizada com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      console.log(ex)
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar atualizar a cidade!`,
        life: 3000
      });
    }
  }

  onDelete(cidadeUI: CidadeUI) {
    try {
      this.cidadeService.deleteCidade(cidadeUI);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Cidade removida com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar remover a cidade!`,
        life: 3000
      });
    }
  }

  onDeleteSelected(cidadesUI: CidadeUI[]) {
    try {
      this.cidadeService.deleteCidades(cidadesUI);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${cidadesUI.length} cidade(s) removida(s) com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar remover ${cidadesUI.length} cidade(s)!`,
        life: 3000
      });
    }
  }
}

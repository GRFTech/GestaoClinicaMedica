import {Component, inject, OnInit, signal} from '@angular/core';
import {TableColumn} from '../../../core/interfaces/table-column';
import {ConsultaService} from '../../../core/services/consulta-service';
import {DynamicCrud} from '../../../core/components/dynamic-crud/dynamic-crud';
import ConsultaUI from '../../../core/model/consulta/ConsultaUI';
import {MessageService} from 'primeng/api';
import {Toast} from 'primeng/toast';
import {PacienteService} from '../../../core/services/paciente-service';
import {MedicoService} from '../../../core/services/medico-service';
import {ExameService} from '../../../core/services/exame-service';
import {EspecialidadeService} from '../../../core/services/especialidade-service';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-consulta',
  imports: [
    DynamicCrud,
    Toast,
    CurrencyPipe
  ],
  providers: [MessageService],
  templateUrl: './consultas.html',
  standalone: true,
  styleUrl: './consultas.scss'
})
export class Consultas implements OnInit {

  consultaService = inject(ConsultaService);
  messageService = inject(MessageService);
  pacienteService = inject(PacienteService);
  medicoService = inject(MedicoService);
  exameService = inject(ExameService);
  especialidadeService = inject(EspecialidadeService);

  constructor() {
  }


  cols!: TableColumn[];

  entityName = "Consultas";

  title = "Gerenciar Consultas";

  t_class = ConsultaUI;

  pacienteOptions = signal<{ label: string, value: string }[]>([]);
  medicoOptions = signal<{ label: string, value: string }[]>([]);
  exameOptions = signal<{ label: string, value: string }[]>([]);

  async ngOnInit() {


    const pacientes = await this.pacienteService.getPacientes();

    this.pacienteOptions.set(pacientes.map(e => ({
      label: e.nome,
      value: e.nome
    })));

    const medico = await this.medicoService.getMedicos();

    this.medicoOptions.set(medico.map(e => ({
      label: e.nome,
      value: e.nome
    })));

    const exame = await this.exameService.getExames();

    this.exameOptions.set(exame.map(e => ({
      label: e.descricao,
      value: e.descricao
    })));

    this.cols = [
      {field: 'codigo_consulta', header: 'Código da Consulta', editable: false, type: 'number', insertable: false, exhibitable: true},
      {field: 'data', header: 'Data', editable: true, type: 'datetime', insertable: true, exhibitable: true},
      {
        field: 'paciente',
        header: 'Paciente',
        editable: false,
        type: 'select',
        insertable: true,
        options: this.pacienteOptions(),
        exhibitable: true
      },
      {
        field: 'cidade_paciente',
        header: 'Cidade do Paciente',
        editable: false,
        type: 'text',
        insertable: false,
        exhibitable: true
      },
      {
        field: 'valor_total',
        header: 'Valor a ser pago',
        editable: false,
        type: 'currency',
        insertable: false,
        exhibitable: true
      },
      {
        field: 'medico',
        header: 'Medico',
        editable: false,
        type: 'select',
        insertable: true,
        options: this.medicoOptions(),
        exhibitable: true
      },
      {
        field: 'exame',
        header: 'Exame',
        editable: false,
        type: 'select',
        insertable: true,
        options: this.exameOptions(),
        exhibitable: true
      }
    ];
  }

  onSave(ui: ConsultaUI) {
    this.consultaService.createConsulta(ui).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: res.mensagem ?? 'Consulta salva com sucesso!',
          life: 3000
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.message ?? 'Ocorreu um erro ao salvar a consulta!',
          life: 4000
        });
      }
    });
  }

  onEdit(ui: ConsultaUI) {
    this.consultaService.updateConsulta(ui).subscribe({
      next: (res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: res.mensagem ?? 'Consulta atualizada com sucesso!',
          life: 3000
        });
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.message ?? 'Ocorreu um erro ao atualizar a consulta!',
          life: 4000
        });
      }
    });
  }


  onDelete(ui: ConsultaUI) {

    try {
      this.consultaService.deleteConsulta(ui);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Consulta removida com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao deletar a consulta!`,
        life: 3000
      });
    }
  }

  onDeleteSelected(uis: ConsultaUI[]) {
    try {
      this.consultaService.deleteConsultas(uis);
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `${uis.length} consulta(s) removida(s) com sucesso!`,
        life: 3000
      });
    } catch (ex) {
      this.messageService.add({
        severity: 'error',
        summary: 'Ocorreu um erro!',
        detail: `Ocorreu um erro ao tentar deletar ${uis.length} consulta(s)!`,
        life: 3000
      });
    }
  }

  somaTotal() {
    let total = 0;

    this.consultaService.consultasUI().forEach(c => total += (c.valor_total))

    return total;
  }

}

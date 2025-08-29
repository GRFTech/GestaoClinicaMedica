import {Component, input} from '@angular/core';
import {TableColumn} from '../../interfaces/table-column';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {AbstractDataType} from '../../interfaces/abstract-data-type';
import {InputNumber} from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-crud-field',
  imports: [
    FormsModule,
    InputText,
    InputNumber,
    DatePickerModule
  ],
  templateUrl: './crud-field.html',
  standalone: true,
  styleUrl: './crud-field.scss'
})
export class CrudField<T extends AbstractDataType> {

  col = input.required<TableColumn>();
  isEditable = input.required<boolean>();
  currentItem = input.required<T>();
  submitted = input.required<boolean>()
  protected readonly DatePickerModule = DatePickerModule;
}

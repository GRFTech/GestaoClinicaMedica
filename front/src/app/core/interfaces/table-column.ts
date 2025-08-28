/**
 * @description
 * Interface para definir as colunas de uma tabela genérica.
 *
 * @field field O nome da propriedade do objeto (data key).
 * @field header O título da coluna a ser exibido na tabela.
 * @field editable Indica se o campo pode ser editado no formulário.
 * @field type O tipo de input para o campo no formulário (ex: 'text', 'number', 'date').
 */
export interface TableColumn {
  field: string;
  header: string;
  editable?: boolean;
  type?: string;
}

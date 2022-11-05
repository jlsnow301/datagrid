export type CellData = string | number | boolean | null;

export type DynamicDialogProps = Omit<TableConstructorProps, "data"> & {
  initialContent: RowData;
  modalIsOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RowData) => void;
};

export type DynamicFormProps = Omit<
  DynamicDialogProps,
  "initialContent" | "modalIsOpen"
> & {
  content: RowData;
};

export type DynamicTableProps = TableConstructorProps & {
  onEdit?: (row: RowData) => void;
  onNew?: () => void;
};

export type DynamicWizardProps = Pick<TableConstructorProps, "templates"> &
  Pick<DynamicDialogProps, "onClose"> & {
    onSetTemplate: (template: RowData) => void;
  };

export type ConstructorOption = Partial<{
  cell: (value: CellData) => JSX.Element;
  label: string;
  hidden: boolean;
  multiline: boolean;
  noForm: boolean;
  noTable: boolean;
  optional: boolean;
  selections: string[] | number[];
}>;

export type ConstructorOptions = Record<string, ConstructorOption>;

export type RowData = Record<string, CellData>;

export type TableConstructorProps = {
  data: RowData[];
  // Adds edit/insert, then creates dialogs for editing/inserting rows
  editable?: boolean;
  // Allows you to edit how inputs are displayed in the edit dialog
  options?: ConstructorOptions;
  // This must be the function that you want to call when you want to edit a row
  onSave?: (data: RowData) => void;
  // An array of objects that can be used to fill in the form
  templates?: RowData[];
};

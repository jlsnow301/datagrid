import { FieldValues } from "react-hook-form";

export type RowData = Record<string, string | number | boolean | null>;

export type TableConstructorProps = {
  data: RowData[];
  editable?: boolean;
  cellOverride?: Record<string, (row: RowData) => JSX.Element>;
  labelOverride?: Record<string, string>;
  onSave?: (data: RowData) => void;
  optionalKeys?: string[];
  selections?: Record<string, number[] | string[]>;
  displayColumns?: string[];
  templates?: RowData[];
};

export type DynamicTableProps = TableConstructorProps & {
  onEdit?: (row: RowData) => void;
  onNew?: () => void;
};

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

export type DynamicWizardProps = Pick<TableConstructorProps, "templates"> &
  Pick<DynamicDialogProps, "onClose"> & {
    onSetTemplate: (template: RowData) => void;
  };

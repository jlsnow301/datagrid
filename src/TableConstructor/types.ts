import { FieldValues } from "react-hook-form";

export type RowData = Record<string, string | number | boolean>;

export type TableConstructorProps = {
  data: RowData[];
  editable?: boolean;
  cellOverride?: Record<string, (row: object) => JSX.Element>;
  labelOverride?: Record<string, string>;
  onSave?: (data: FieldValues) => void;
  optionalKeys?: string[];
  selections?: Record<string, number[] | string[]>;
};

export type DynamicDialogProps = Omit<TableConstructorProps, "data"> & {
  content: RowData;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FieldValues) => void;
};

export type DynamicTableProps = TableConstructorProps & {
  onEdit?: (row: RowData) => void;
  onNew?: () => void;
};

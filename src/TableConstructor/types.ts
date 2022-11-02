import { FieldValues } from "react-hook-form";

export type AnyObject<Type> = object & Exclude<Type, any[]>;

export type EmptyObject = Record<string, any>;

export type TableConstructorProps<TData> = {
  data: AnyObject<TData>[];
  editable?: boolean;
  cellOverride?: Record<string, (row: object) => JSX.Element>;
  labelOverride?: Record<string, string>;
  onSave?: (data: FieldValues) => void;
  optionalKeys?: string[];
  selections?: Record<string, number[] | string[]>;
};

export type DynamicDialogProps<TData> = Omit<
  TableConstructorProps<TData>,
  "data"
> & {
  content: AnyObject<TData>;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FieldValues) => void;
};

export type DynamicTableProps<TData> = TableConstructorProps<TData> & {
  onEdit?: (row: AnyObject<TData>) => void;
  onNew?: () => void;
};

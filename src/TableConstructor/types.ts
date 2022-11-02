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
};

export type DynamicDialogProps<TData> = Pick<
  TableConstructorProps<TData>,
  "labelOverride" | "optionalKeys"
> & {
  content: AnyObject<TData> | EmptyObject;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FieldValues) => void;
};

export type DynamicTableProps<TData> = TableConstructorProps<TData> & {
  onEdit?: (row: AnyObject<TData>) => void;
  onNew?: () => void;
};

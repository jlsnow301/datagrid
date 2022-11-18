import { Row } from "@tanstack/react-table";

export type CellData = string | number | boolean | null;

export type DynamicDialogProps = Omit<TableConstructorProps, "data"> & {
  editing: boolean;
  formContent: RowData;
  modalIsOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RowData) => void;
};

export type DynamicFormProps = Omit<
  DynamicDialogProps,
  "formContent" | "modalIsOpen"
> & {
  content: RowData;
};

export type DynamicTableProps = Omit<TableConstructorProps, "editable"> & {
  editable: boolean;
  onEdit?: (row: RowData) => void;
  onNew?: () => void;
};

export type DynamicWizardProps = Pick<TableConstructorProps, "templates"> &
  Pick<DynamicDialogProps, "onClose"> & {
    onSetTemplate: (template: RowData) => void;
  };

type CommonOptions = Partial<{
  cell: (value: CellData) => JSX.Element;
  label: string;
  hidden: boolean;
  multiline: boolean;
  noForm: boolean;
  noTable: boolean;
  selections: string[] | number[];
  size: "sm" | "md" | "lg" | "xl";
}>;

type TypeOptions =
  | {
      number?: true;
      boolean?: false;
      optional?: false;
    }
  | {
      number?: false;
      boolean?: false;
      optional?: true;
    }
  | {
      number?: false;
      boolean?: true;
      optional?: false;
    };

export type ConstructorOption = CommonOptions & TypeOptions;

export type ConstructorOptions = Record<string, ConstructorOption>;

export type RowData = Record<string, CellData>;

type CommonProps = {
  data: RowData[];
  label?: string;
  grayscale?: boolean;
  noIndex?: boolean;
  options?: ConstructorOptions;
  onSelect?: (row?: Row<RowData>) => void;
};

type EditableProps =
  | {
      // Adds edit/insert, then creates dialogs for editing/inserting rows
      editable: true;
      onDelete?: (id: string) => void;
      onSave: (data: RowData) => void;
      // An array of objects that can be used to fill in the form
      templates?: RowData[];
    }
  | {
      editable?: false;
      onDelete?: never;
      onSave?: never;
      templates?: never;
    };

export type TableConstructorProps = CommonProps & EditableProps;

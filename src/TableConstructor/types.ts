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
  cell: (value: string) => JSX.Element;
  disabled: boolean;
  label: string;
  hidden: boolean;
  multiline: boolean;
  noForm: boolean;
  noTable: boolean;
  onPickItem: (value: string) => void;
  selections: string[] | ((value: string) => string[]);
  size: "sm" | "md" | "lg" | "xl";
  value: ((value: string) => string) | string;
}>;

type TypeOptions =
  | {
      number?: true;
      boolean?: false;
      optional?: false;
      date?: false;
    }
  | {
      number?: false;
      boolean?: false;
      optional?: true;
      date?: false;
    }
  | {
      number?: false;
      boolean?: true;
      optional?: false;
      date?: false;
    }
  | {
      number?: false;
      boolean?: false;
      optional?: boolean;
      date?: true;
    };

export type ConstructorOption = CommonOptions & TypeOptions;

export type ConstructorOptions = Map<string, ConstructorOption>;

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
      onClose?: () => void;
      onDelete?: (id: string) => void;
      onSave: (data: RowData) => void;
      // An array of objects that can be used to fill in the form
      templates?: RowData[];
    }
  | {
      editable?: false;
      onClose?: never;
      onDelete?: never;
      onSave?: never;
      templates?: never;
    };

export type TableConstructorProps = CommonProps & EditableProps;

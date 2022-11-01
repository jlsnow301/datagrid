import { Row } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { DialogConstructor } from "./Dialog";
import { TableConstructor } from "./Table";

export type PageConstructorProps<TData> = {
  data: TData[];
  editable?: boolean;
  cellOverride?: ((row: Row<TData>) => JSX.Element)[];
  labelOverride?: Record<string, string>;
  onSave?: (data: FieldValues) => void;
};

/**
 * ## PageConstructor
 * A page component that takes an array of objects and creates a table from it.
 * If marked as editable, it will also create a dialog for editing the data.
 * If a save function is provided, it will be called when the dialog is submitted.
 *
 * Data is any array of objects. The keys of the first object will be used as the
 * column headers.
 */
export const PageConstructor = <TData extends Record<string, any>>(
  props: PageConstructorProps<TData>
) => {
  const { data, editable, cellOverride, labelOverride, onSave } = props;
  const [content, setContent] = useState<TData | Record<string, any>>({});
  const [open, setOpen] = useState(false);
  const emptySchema = useMemo(() => createEmptySchema(data[0]), [data]);

  /** Closes the dialog and resets values.*/
  const onClose = () => {
    setOpen(false);
    setContent({});
  };

  /** Opens the dialog and sets values.*/
  const onEdit = (row: TData) => {
    setContent(row);
    setOpen(true);
  };

  /** Opens the dialog and sets values to empty. */
  const onNew = () => {
    setContent(emptySchema);
    setOpen(true);
  };

  /** If the parent has created a save action, uses it. */
  const onSubmit = (data: FieldValues) => {
    onClose();
    if (onSave) {
      onSave(data);
    }
  };

  return (
    <div className="h-full w-full p-2">
      {editable && open && (
        <DialogConstructor
          {...{ content, labelOverride, open, onClose, onSubmit }}
        />
      )}
      <TableConstructor
        {...{
          data,
          editable,
          cellOverride,
          labelOverride,
          onEdit,
          onNew,
        }}
      />
    </div>
  );
};

/** Cached schema of the first object in data[].  */
const createEmptySchema = (data: object) => {
  return Object.fromEntries(
    Object.entries(data)?.map(([key, value]) => [key, getGenericValue(value)])
  );
};

/** Returns a generic primitive based on input.  */
const getGenericValue = (value: any) => {
  if (value instanceof Array) {
    return [];
  } else if (typeof value === "boolean") {
    return false;
  } else if (typeof value === "number") {
    return 0;
  } else return "";
};

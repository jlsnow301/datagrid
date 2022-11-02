import { useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { DynamicDialog } from "./Dialog";
import { getGenericValue } from "./helpers";
import { DynamicTable } from "./Table";
import { AnyObject, TableConstructorProps } from "./types";

/**
 * ## PageConstructor
 * A page component that takes an array of objects and creates a table from it.
 * If marked as editable, it will also create a dialog for editing the data.
 * If a save function is provided, it will be called when the dialog is submitted.
 *
 * Data is any array of objects. The keys of the first object will be used as the
 * column headers.
 */
export function TableConstructor<TData>(props: TableConstructorProps<TData>) {
  const {
    data,
    editable,
    cellOverride,
    labelOverride,
    onSave,
    optionalKeys,
    selections,
  } = props;

  const emptySchema = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(data[0])?.map(([key, value]) => [
          key,
          getGenericValue(value),
        ])
      ) as AnyObject<TData>,
    [data]
  );

  const [content, setContent] = useState(emptySchema);
  const [open, setOpen] = useState(false);

  /** Closes the dialog and resets values.*/
  function onClose() {
    setOpen(false);
  }

  /** Opens the dialog and sets values.*/
  function onEdit(row: AnyObject<TData>) {
    setContent(row);
    setOpen(true);
  }

  /** Opens the dialog and sets values to empty. */
  function onNew() {
    setContent(emptySchema);
    setOpen(true);
  }

  /** If the parent has created a save action, uses it. */
  function onSubmit(data: FieldValues) {
    onClose();
    if (onSave) {
      onSave(data);
    }
  }

  return (
    <div className="h-full w-full p-2">
      {editable && open && (
        <DynamicDialog
          {...{
            content,
            labelOverride,
            onClose,
            onSubmit,
            open,
            optionalKeys,
            selections,
          }}
        />
      )}
      <DynamicTable
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
}

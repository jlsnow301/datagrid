import { useMemo, useState } from "react";
import { FieldValues } from "react-hook-form";
import { DynamicDialog } from "./Dialog";
import { getGenericValue } from "./helpers";
import { DynamicTable } from "./Table";
import { AnyObject, EmptyObject, TableConstructorProps } from "./types";

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
  const { data, editable, cellOverride, labelOverride, onSave, optionalKeys } =
    props;
  const [content, setContent] = useState<AnyObject<TData> | EmptyObject>({});
  const [open, setOpen] = useState(false);

  const emptySchema = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(data[0])?.map(([key, value]) => [
          key,
          getGenericValue(value),
        ])
      ),
    [data]
  );

  /** Closes the dialog and resets values.*/
  function onClose() {
    setOpen(false);
    setContent({});
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
          {...{ content, labelOverride, onClose, onSubmit, open, optionalKeys }}
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

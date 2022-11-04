import { useMemo, useState } from "react";
import { DynamicDialog } from "./Dialog";
import { getGenericValue } from "./helpers";
import { DynamicTable } from "./Table";
import { TableConstructorProps, RowData } from "./types";

/**
 * ## PageConstructor
 * A page component that takes an array of objects and creates a table from it.
 * If marked as editable, it will also create a dialog for editing the data.
 * If a save function is provided, it will be called when the dialog is submitted.
 *
 * Data is any array of objects. The keys of the first object will be used as the
 * column headers.
 */
export function TableConstructor(props: TableConstructorProps) {
  const {
    data,
    editable,
    cellOverride,
    labelOverride,
    onSave,
    optionalKeys,
    selections,
    displayColumns,
    templates,
  } = props;

  const emptySchema = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(data[0])?.map(([key, value]) => [
          key,
          getGenericValue(value),
        ])
      ) as RowData,
    [data]
  );

  const [initialContent, setInitialContent] = useState(emptySchema);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  /** Closes the dialog and resets values.*/
  function onClose() {
    setModalIsOpen(false);
  }

  /** Opens the dialog and sets values.*/
  function onEdit(row: RowData) {
    setInitialContent(row);
    setModalIsOpen(true);
  }

  /** Opens the dialog and sets values to empty. */
  function onNew() {
    setInitialContent(emptySchema);
    setModalIsOpen(true);
  }

  /** If the parent has created a save action, uses it. */
  function onSubmit(data: RowData) {
    onClose();
    if (onSave) {
      onSave(data);
    }
  }

  return (
    <div className="h-full w-full p-2">
      {editable && modalIsOpen && (
        <DynamicDialog
          {...{
            initialContent,
            labelOverride,
            modalIsOpen,
            onClose,
            onSubmit,
            optionalKeys,
            selections,
            templates,
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
          displayColumns,
        }}
      />
    </div>
  );
}

import { useMemo, useState } from "react";
import { DynamicDialog } from "./Dialog";
import { getGenericValue } from "./helpers";
import { DynamicTable } from "./Table";
import { RowData, TableConstructorProps } from "./types";

export function TableConstructor(props: TableConstructorProps) {
  const { data, editable, options, onSave, templates } = props;

  const emptySchema = useMemo(() => {
    const toDisplay =
      (options &&
        Object.fromEntries(
          Object.entries(options).filter(
            ([, value]) => !value.noForm && !value.hidden
          )
        )) ||
      data[0];
    return Object.keys(toDisplay).reduce((acc, key) => {
      acc[key] = getGenericValue(data[0][key]);
      return acc;
    }, {} as RowData);
  }, [data, options]);

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
    <>
      {editable && modalIsOpen && (
        <DynamicDialog
          {...{
            options,
            initialContent,
            modalIsOpen,
            onClose,
            onSubmit,
            templates,
          }}
        />
      )}

      <DynamicTable
        {...{
          data,
          editable,
          options,
          onEdit,
          onNew,
        }}
      />
    </>
  );
}

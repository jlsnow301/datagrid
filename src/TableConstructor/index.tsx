import { memo, useMemo, useState } from "react";
import { RowData, TableConstructorProps } from "./types";
import { DynamicDialog } from "./Dialog";
import { getGenericValue } from "./helpers";
import { DynamicTable } from "./Table";

/** Memoized below */
function TableComponent(props: TableConstructorProps) {
  const { data, editable, label, onDelete, onSave, options, templates } = props;

  const emptyForm = useMemo(() => {
    if (!data || !data.length) return {};
    const toDisplay =
      (options &&
        Object.fromEntries(
          Object.entries(options)?.filter(
            // We need to filter out invalid and hidden options
            ([key, value]) => !value.noForm && !value.hidden && key in data[0]
          )
        )) ||
      data[0];
    return Object.keys(toDisplay).reduce((acc, key) => {
      acc[key] = getGenericValue(data[0][key]);
      return acc;
    }, {} as RowData);
  }, [data, options]);

  const [formContent, setFormContent] = useState(emptyForm);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const editing =
    Object.keys(formContent).length !== Object.keys(emptyForm).length;

  /** Closes the dialog and resets values.*/
  function onClose() {
    setModalIsOpen(false);
  }

  /** Opens the dialog and sets values.*/
  function onEdit(row: RowData) {
    setFormContent(row);
    setModalIsOpen(true);
  }

  /** Opens the dialog and sets values to empty. */
  function onNew() {
    setFormContent(emptyForm);
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
            editing,
            formContent,
            label,
            modalIsOpen,
            onClose,
            onDelete,
            onSubmit,
            options,
            templates,
          }}
        />
      )}

      <DynamicTable
        {...{
          data,
          editable,
          label,
          options,
          onEdit,
          onNew,
        }}
      />
    </>
  );
}

/**
 * ## TableConstructor
 * This component is a wrapper around the DynamicTable and DynamicDialog components.
 * It is a swiss army knife of displaying tables with editable data.
 *
 * It can be run on data alone, but can be fed templates, editable status, and options.
 */
export const TableConstructor = memo(TableComponent);

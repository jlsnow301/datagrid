import { memo, useMemo, useState } from "react";
import { RowData, TableConstructorProps } from "./types";
import { DynamicDialog } from "./Dialog";
import { getGenericValue, hasOption } from "./helpers";
import { DynamicTable } from "./Table";

//** Memoized below */
function TableComponent(props: TableConstructorProps) {
  const {
    data,
    editable = false,
    grayscale,
    label,
    noIndex,
    onDelete,
    onSave,
    onSelect,
    options,
    templates,
  } = props;

  if (editable && !options) {
    console.warn(
      `No options provided to an editable TableConstructor. This is dangerous, 
      if no data is provided we cannot infer the form validation schema.`
    );
    if (!data || data.length === 0) {
      return (
        <div style={{ color: "gray", marginTop: "5rem" }}>
          No data to display.
        </div>
      );
    }
  }

  /**
   * We use this to infer the types from the validation object.
   * In the ideal scenario, the user has provided the right types in options.
   */
  const emptyForm = useMemo(() => {
    if (!editable) return {};
    const formSchema = options || data[0] || {};
    // Filter out any keys that are hidden
    return Object.keys(formSchema)
      .filter((key) => !hasOption(key, options, ["hidden", "noForm"]))
      .reduce((obj, key) => {
        obj[key] = getGenericValue(key, options);
        return obj;
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
    if (!editable || !options) return;
    const formDefaults = Object.keys(options).reduce((obj, key) => {
      obj[key] = row[key]
        ? row[key]
        : !hasOption(key, options, ["hidden", "noForm", "number"])
        ? ""
        : -1;
      return obj;
    }, {} as RowData);
    setFormContent(formDefaults);
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
          grayscale,
          label,
          noIndex,
          options,
          onEdit,
          onNew,
          onSelect,
        }}
      />
    </>
  );
}

/**
 * ## TableConstructor
 * A wrapper around the DynamicTable and DynamicDialog components.
 *
 * It is a swiss army knife of displaying tables with editable data.
 *
 * It can be run on data alone, but can be fed templates, editable status, and column-specific options.
 *
 * The table will automatically virtualize after 200 rows.
 *
 * @usage
 * ```tsx
 * <TableConstructor
 *    data={data} // Required, an array of objects
 *    editable // Optional, defaults to false
 *    fallback={fallback} // Optional, but in editable mode, this is required
 *    label="My Table" // Optional, defaults to "item" or "title"
 *    options={options} // Optional, an object that takes options for any key in data. (DataKey: {option: value})
 *    onSave={onSave} // Optional, a function that is called when the form is submitted.
 *    onDelete={onDelete} // Optional, a function that is called when the delete button is pressed.
 *    templates={templates} // Optional, "favorites" of data, the user can select one to populate the form.
 *  />
 * ```
 */
export const TableConstructor = memo(TableComponent);

import { Paper, TableContainer } from "@mui/material";
import { FunctionComponent, useMemo, useState } from "react";
import { Row } from "react-table";
import { DialogConstructor } from "./Dialog";
import { TableConstructor } from "./Table";

export type PageConstructor = {
  data: readonly object[];
  editable?: boolean;
  cellOverride?: ((row: Row) => JSX.Element)[];
  labelOverride?: Array<string | undefined>;
  onSave?: (data: object) => void;
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
export const PageConstructor: FunctionComponent<PageConstructor> = (props) => {
  const { data, editable, cellOverride, labelOverride, onSave } = props;
  const [content, setContent] = useState<object | undefined>();
  const [open, setOpen] = useState(false);

  /** Cached schema of the first object in data[].  */
  const createEmptyObject = useMemo(() => {
    return Object.fromEntries(
      Object.entries(data[0])?.map(([key, value]) => [
        key,
        getGenericValue(value),
      ])
    );
  }, [data]);

  /** Closes the dialog and resets values.*/
  const onClose = () => {
    setContent(undefined);
    setOpen(false);
  };

  /** Opens the dialog and sets values.*/
  const onEdit = (row: Row) => {
    setContent(row.original);
    setOpen(true);
  };

  /** Opens the dialog and sets values to empty. */
  const onNew = () => {
    setContent(createEmptyObject);
    setOpen(true);
  };

  /** If the parent has created a save action, uses it. */
  const onSubmit = (data: object) => {
    onClose();
    if (onSave) {
      onSave(data);
    }
  };

  return (
    <div className="h-full p-2">
      {editable && (
        <DialogConstructor
          {...{ content, labelOverride, open, onClose, onSubmit }}
        />
      )}
      <TableContainer
        className="overflowy h-full overflow-y-scroll"
        component={Paper}
      >
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
      </TableContainer>
    </div>
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

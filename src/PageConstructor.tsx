import { TableContainer, Paper } from "@mui/material";
import { FunctionComponent, useMemo, useState } from "react";
import { Row } from "react-table";
import { DialogConstructor } from "./DialogConstructor";
import { TableConstructor } from "./TableConstructor";

export type PageConstructor = {
  data: readonly object[];
  editable?: boolean;
  cellOverride?: ((row: Row) => JSX.Element)[];
  labelOverride?: Array<string | undefined>;
  onSave?: (data: object) => void;
};

export const PageConstructor: FunctionComponent<PageConstructor> = (props) => {
  const { data, editable, cellOverride, labelOverride, onSave } = props;
  const [content, setContent] = useState<object | undefined>();
  const [open, setOpen] = useState(false);

  // Create an empty object with the same keys as the first object in the data array.
  const createEmptyObject = useMemo(() => {
    return Object.fromEntries(
      Object.entries(data[0])?.map(([key, value]) => [key, getValueType(value)])
    );
  }, [data]);

  const onClose = () => {
    setContent(undefined);
    setOpen(false);
  };

  const onEdit = (row: Row) => {
    setContent(row.original);
    setOpen(true);
  };

  const onNew = () => {
    setContent(createEmptyObject);
    setOpen(true);
  };

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

const getValueType = (value: any) => {
  if (value instanceof Array) {
    return [];
  } else if (typeof value === "boolean") {
    return false;
  } else return "";
};

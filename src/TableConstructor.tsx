import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FunctionComponent, memo, useMemo } from "react";
import { Column, Row, useTable } from "react-table";
import { toTitleCase } from "./strings";

type Props = {
  data: readonly object[];
  editable?: boolean;
  cellOverride?: ((row: Row) => JSX.Element)[];
  labelOverride?: Array<string | undefined>;
  onEdit?: (row: Row) => void;
  onNew?: () => void;
};

/**
 * ## TableConstructor
 * A table component that takes an array of objects and creates a table from it.
 *
 * Data is any array of objects. The keys of the first object will be used as the
 * column headers.
 *
 * Editable is a boolean that determines if the table is editable or not.
 *
 * CellOverride is an array of functions that takes a cell and returns a JSX.Element. This
 * allows you to override the default cell rendering.
 *
 * Label override is an array of strings that will be used as the column headers.
 * If the array is shorter than the number of columns, the remaining columns will
 * use the default header. If not provided, the default header will be the
 * capitalized version of the key.
 */
export const TableConstructor: FunctionComponent<Props> = memo((props) => {
  const {
    cellOverride,
    editable = false,
    data = [],
    labelOverride,
    onEdit,
    onNew,
  } = props;

  const handleEditClick = (row: Row) => {
    if (onEdit) {
      onEdit(row);
    }
  };

  const handleNewClick = () => {
    if (onNew) {
      onNew();
    }
  };

  /** Memoized columns. Builds them using the object's keyname. */
  const columns = useMemo(() => {
    if (Object.keys(data).length === 0) {
      return [];
    }

    let columns: Column<object>[] = [];
    const columnGroup = Object.keys(data[0]).map((item, index) => ({
      Header:
        (labelOverride &&
          labelOverride?.length > index &&
          labelOverride[index]) ||
        toTitleCase(item),
      accessor: item,
      Cell: (cell: { row: Row }) =>
        cellOverride && cellOverride[index]
          ? cellOverride[index]
          : cell.row.values[item].toString(),
    }));
    columns = [...columnGroup];

    if (editable) {
      const editColumn: Column = {
        Header: (
          <IconButton onClick={handleNewClick}>
            <AddCircleIcon />
          </IconButton>
        ),
        id: "actions",
        Cell: ({ row }) => (
          <IconButton onClick={() => handleEditClick(row)}>
            <EditIcon />
          </IconButton>
        ),
      };
      columns = [...columns, editColumn];
    }

    return columns;
  }, [data]);

  const scrollbarWidth = useMemo(() => getScrollbarWidth(), [data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <Table {...getTableProps()} stickyHeader>
      <TableHead>
        {headerGroups.map((headerGroup) => (
          <TableRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <TableCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableHead>
      <TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <TableRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableCell {...cell.getCellProps()}>
                    {cell.render("Cell")}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});

/**
 * Gets scrollbar width.
 * Thanks to https://davidwalsh.name/detect-scrollbar-width
 */
const getScrollbarWidth = () => {
  //
  const scrollDiv = document.createElement("div");
  scrollDiv.setAttribute(
    "style",
    "width: 100px; height: 100px; overflow: scroll; position:absolute; top:-9999px;"
  );
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

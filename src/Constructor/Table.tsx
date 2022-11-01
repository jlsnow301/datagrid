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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtual, VirtualItem } from "react-virtual";
import { toTitleCase } from "../strings";
import { PageConstructorProps } from "./Page";

type TableProps<TData> = PageConstructorProps<TData> & {
  onEdit?: (row: TData) => void;
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
export const TableConstructor = <TData extends Record<string, any>>(
  props: TableProps<TData>
) => {
  const {
    cellOverride,
    editable = false,
    data = [],
    labelOverride,
    onEdit,
    onNew,
  } = props;
  const largeList = data.length > 100;
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  /** If the parent has an edit function, use it */
  const handleEditClick = (row: Row<TData>) => {
    if (onEdit) {
      onEdit(row.original);
    }
  };

  /** If a parent def for saving a new item exists, use it */
  const handleNewClick = () => {
    if (onNew) {
      onNew();
    }
  };

  const columns = useMemo<ColumnDef<TData>[]>(() => {
    const initialColumns: ColumnDef<TData>[] = Object.keys(data[0]).map(
      (key, index) => ({
        accessorKey: key,
        cell: ({ row }) => {
          if (cellOverride && cellOverride[index]) {
            return cellOverride[index](row);
          }
          return row.original[key].toString();
        },
        header: (labelOverride && labelOverride[key]) || toTitleCase(key),
        size: 0,
      })
    );
    if (editable) {
      initialColumns.push({
        cell: ({ row }) => (
          <IconButton onClick={() => handleEditClick(row)}>
            <EditIcon />
          </IconButton>
        ),
        id: "actions",
        header: () => (
          <IconButton onClick={handleNewClick}>
            <AddCircleIcon />
          </IconButton>
        ),
        size: 0,
      });
    }
    return initialColumns;
  }, [data, labelOverride, editable]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  let paddingTop = 0;
  let paddingBottom = 0;
  let displayRows: Row<TData>[] | VirtualItem[] = rows;

  // If the list is large, we need to use the virtualizer
  if (largeList) {
    displayRows = virtualRows;
    paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
    paddingBottom =
      virtualRows.length > 0
        ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
        : 0;
  }

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
    }
  }, [data]);

  return (
    <TableContainer
      className="h-full"
      component={Paper}
      ref={tableContainerRef}
    >
      <Table stickyHeader>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableCell
                    align="right"
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {paddingTop > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingTop}px` }} />
            </TableRow>
          )}
          {displayRows.map((displayRow) => {
            const row = !largeList
              ? (displayRow as Row<TData>)
              : (rows[displayRow.index] as Row<TData>);
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell align="right" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          {paddingBottom > 0 && (
            <TableRow>
              <TableCell style={{ height: `${paddingBottom}px` }} />
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

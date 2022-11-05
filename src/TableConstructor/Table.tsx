import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtual, VirtualItem } from "react-virtual";
import { tableStyles } from "./tableStyles";
import { DynamicTableProps, RowData } from "./types";
import { toTitleCase } from "../strings";
import { hasOption } from "./helpers";
import { IconButton } from "@mui/material";

export function DynamicTable(props: DynamicTableProps) {
  const { editable, options, data, onEdit, onNew } = props;
  const classes = tableStyles();
  const largeList = data.length > 100;
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  /** If the parent has an edit function, use it */
  function handleEditClick(row: RowData) {
    if (onEdit) {
      onEdit(row);
    }
  }

  /** If a parent def for saving a new item exists, use it */
  function handleNewClick() {
    if (onNew) {
      onNew();
    }
  }

  const columns = useMemo<ColumnDef<RowData>[]>(() => {
    const initialColumns: ColumnDef<RowData>[] = [
      {
        accessorKey: "index",
        cell: ({ row }) => row.index + 1,
        id: "index",
        header: "Index",
        size: 0,
      } as ColumnDef<RowData>,
    ];

    const toDisplay =
      (options &&
        Object.keys(options).filter(
          (key) => !hasOption(key, options, ["noTable", "hidden"])
        )) ||
      Object.keys(data[0]);

    toDisplay.map((key) =>
      initialColumns.push({
        accessorKey: key,
        cell: ({ row: { original } }) => {
          if (options && options[key]?.cell) {
            const renderFn = options[key]?.cell;
            if (renderFn) renderFn(original[key]);
          }
          return String(original[key as keyof RowData]);
        },
        header: (options && options[key]?.label) || toTitleCase(key),
        size: 0,
      })
    );

    if (editable) {
      initialColumns.push({
        cell: ({ row: { original } }) => (
          <IconButton onClick={() => handleEditClick(original)}>
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
  }, [data]);

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
  let displayRows: Row<RowData>[] | VirtualItem[] = rows;

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
      className={classes.tableContainer}
      component={Paper}
      ref={tableContainerRef}
    >
      <Table stickyHeader>
        <TableHead className={classes.cellHeader}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableCell
                    align="right"
                    className={classes.cellHeader}
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
              ? (displayRow as Row<RowData>)
              : (rows[displayRow.index] as Row<RowData>);
            return (
              <TableRow
                className={clsx(
                  classes.tableRow,
                  row.index % 2 === 0 && classes.lightRow,
                  row.index % 2 !== 0 && classes.darkRow
                )}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      align="right"
                      className={classes.cell}
                      key={cell.id}
                      padding="none"
                    >
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
}

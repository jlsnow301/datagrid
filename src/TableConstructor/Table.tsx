import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import {
  AccessorColumnDef,
  ColumnDef,
  DisplayColumnDef,
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
import { getColumnSize, hasOption } from "./helpers";

/**
 * ## DynamicTable
 * This component is a wrapper around the react-table library. It is designed to
 * be used with the TableConstructor component. It will display the data in a
 * table and allow the user to edit the data in a form.
 */
export function DynamicTable(props: DynamicTableProps) {
  const {
    data,
    editable,
    grayscale,
    label,
    noIndex,
    onEdit,
    onNew,
    onSelect,
    options,
  } = props;
  const [selection, setSelection] = useState<Row<RowData>>();
  const classes = tableStyles();

  const largeList = data?.length > 100;
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

  /** If there is a select function, use it */
  function handleRowClick(row: Row<RowData>) {
    if (!onSelect) return;
    const target = row === selection ? undefined : row;
    onSelect(target);
    setSelection(target);
  }

  /**
   * Creates a column definition for each key in the data.
   * Skips columns that have hidden or noTable options.
   */
  const columns = useMemo<ColumnDef<RowData>[]>(() => {
    const initialColumns: ColumnDef<RowData>[] = !noIndex
      ? [
          {
            accessorFn: (row: Row<RowData>) => row.index + 1,
            cell: ({ row }) => row.index + 1,
            id: "#",
            size: 0,
          } as DisplayColumnDef<RowData>,
        ]
      : [];

    // If there is no data, we cannot infer the columns
    Object.keys(options || data[0] || {})
      .filter((key) => !hasOption(key, options, ["noTable", "hidden"]))
      .map((key) =>
        initialColumns.push({
          accessorKey: key,
          cell: ({ row: { original } }) => {
            if (options && options[key]?.cell) {
              const renderFn = options[key]?.cell;
              if (renderFn) {
                return renderFn(original[key]);
              }
            }
            return (original[key] && String(original[key])) || "";
          },
          header:
            (options && options[key]?.label) ||
            (key === "Title" && label && toTitleCase(label)) ||
            toTitleCase(key),
          size: (options && getColumnSize(options[key]?.size)) || 0,
        } as AccessorColumnDef<RowData>)
      );

    if (editable) {
      initialColumns.push({
        cell: ({ row: { original } }) => (
          <Button
            onClick={() => handleEditClick(original)}
            sx={{ marginRight: "0.5rem" }}
          >
            <EditIcon />
          </Button>
        ),
        id: "actions",
        header: () => (
          <Button onClick={handleNewClick}>
            <AddCircleIcon />
          </Button>
        ),
        size: 0,
      } as DisplayColumnDef<RowData>);
    }

    return initialColumns;
  }, [data]);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id:
        ("id" in columns[0] && columns[0].id) ||
        ("accessorKey" in columns[0] && columns[0].accessorKey) ||
        "",
      desc: true,
    },
  ]);

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
                    className={
                      !grayscale
                        ? classes.cellHeader
                        : clsx(classes.cellHeader, classes.grayHeader)
                    }
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      width: header.getSize(),
                    }}
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
                  row === selection && classes.selected,
                  displayRow.index % 2 === 0 && classes.lightRow,
                  displayRow.index % 2 !== 0 && classes.darkRow
                )}
                key={row.id}
              >
                {row.getVisibleCells().map((cell, index) => {
                  const cellData = String(cell.getValue());
                  return (
                    <Tooltip
                      key={index}
                      placement="bottom"
                      title={cellData.length > 40 ? cellData : ""}
                    >
                      <TableCell
                        className={classes.cell}
                        onClick={() => handleRowClick(row)}
                        padding="none"
                        style={{
                          width: cell.column.getSize() || 0,
                          maxWidth: "20rem",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    </Tooltip>
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

import {
  AccessorKeyColumnDef,
  ColumnDef,
  Row,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Dispatch, SetStateAction, useRef, useState } from "react";

import { useVirtual } from "react-virtual";

type GenericProps<TData> = {
  ascending?: boolean;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onSelect?: (row: TData | undefined) => void;
  selected?: TData | undefined;
  sortOn?: keyof TData;
  title?: string;
};

type SpecificProps<TData> = GenericProps<TData> &
  (Editable<TData> | NonEditable);

type Editable<TData> = {
  editable: true;
  onEdit: Dispatch<SetStateAction<TData | undefined>>;
  onNew: () => void;
};

type NonEditable = {
  editable?: false;
  onEdit?: never;
  onNew?: never;
};

/**
 * ### Data Grid.
 * Uses the useReactTable hook to create a table.
 *
 * Easily displays values in a table so you needn't define it yourself.
 *
 * This is a section and card in and of itself, please do not rewrap it.
 *
 * For more documentation on how to structure the data and columns, see the
 * [React Table documentation](
 * https://tanstack.com/table/v8/docs/guide/column-defs).
 *
 * @example
 * ```tsx
 * import { createColumnHelper } from "@tanstack/react-table";
 *
 * type Person = {
 *  firstName: string;
 *  lastName: string;
 * };
 *
 * const columnHelper = createColumnHelper<Person>();
 *
 * const columns = [
 *  columnHelper.accessor("firstName", {
 *   header: "First Name",
 * }),
 * columnHelper.accessor("lastName", {
 *  header: "Last Name",
 * }),
 * ];
 *
 * const data = [
 * { firstName: "John", lastName: "Doe" },
 * { firstName: "Jane", lastName: "Doe" },
 * ];
 *
 * // In the actual component
 * return (
 * <DataGrid data={data} columns={columns} />
 * );
 * ```
 */
export function DataGrid<TData>(props: SpecificProps<TData>) {
  const {
    ascending = false,
    columns,
    data,
    editable,
    onEdit,
    onNew,
    onSelect,
    selected,
    sortOn,
    title = "Data Grid",
  } = props;

  // Just in case someone throws a table at us with no columns,
  // or the first column doesn't have an accessorKey,
  // we'll default to the first column being the sorting column.
  const firstColumn = ("accessorKey" in columns[0] &&
    (columns?.[0] as AccessorKeyColumnDef<TData, string>)) || {
    accessorKey: "",
  };
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: String(sortOn || firstColumn.accessorKey),
      desc: !ascending,
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
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0;

  return (
    <div className="bg-base-100 p-6 flex flex-col flex-1 overflow-y-hidden space-y-2 dark:text-gray-300 rounded-lg">
      <div className="my-4 p-2">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-lg font-semibold leading-6 text-gray-900 dark:text-gray-100">
              {title}
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              {data.length} items
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            {editable && (
              <th className="sticky">
                <button className="btn btn-primary" onClick={onNew}>
                  Add New
                </button>
              </th>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-y-auto rounded-lg">
        <table className="rounded-t-lg flex-1 border-separate border-spacing-0">
          <thead>
            {table.getHeaderGroups().map(({ headers, id }) => (
              <tr key={id}>
                {headers.map((header) => (
                  <th
                    className="sticky top-0 z-10 hidden border-b border-gray-300 bg-base-100 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter dark:bg-base-200 dark:text-gray-300 sm:table-cell"
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
                          style: {
                            display: "flex",
                            flexWrap: "nowrap",
                            alignItems: "center",
                          },
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: "  🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
                {editable && (
                  <th className="sticky top-0 z-10 hidden border-b border-gray-300 bg-base-100 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter dark:bg-base-200 dark:text-gray-300 sm:table-cell"></th>
                )}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>;
              return (
                <tr
                  className={virtualRow.index % 2 === 0 ? "bg-base-200" : ""}
                  key={row.id}
                  onClick={() => onSelect && onSelect(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td
                        className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-700 dark:text-gray-300 lg:table-cell"
                        key={cell.id}
                        style={{
                          width: cell.column.getSize() || 0,
                          maxWidth: "20rem",
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                  {editable && (
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">
                      <button
                        className="btn btn-primary"
                        onClick={() => onEdit(row.original)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

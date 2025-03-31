"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  ColumnFiltersState,
  getSortedRowModel,
  getFilteredRowModel,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskStatus, Task } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Edit,
  MoreVertical,
  Search,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { DeleteConfirmationDialog } from "../delete-alert";
import { Skeleton } from "../ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useDeleteTask, useTasks } from "@/hooks/use-tasks";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
}

const ActionsCell = ({ row }: { row: Row<Task> }) => {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { mutate: deleteTask } = useDeleteTask();

  const handleEdit = () => router.push(`/tasks/edit/${row.original.id}`);

  const handleDelete = () => {
    deleteTask(row.original.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="cursor-pointer"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
            className="cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
};

export function TaskTable<TData extends { id: number }, TValue>({
  columns,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const { data: tasksData, isLoading } = useTasks();
  const { mutate: deleteTask } = useDeleteTask();
  const [deleteTaskId, setDeleteTaskId] = useState<number | null>(null);

  const table = useReactTable({
    data: tasksData || [],
    columns,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleRowClick = (taskId: number) => {
    router.push(`/tasks/${taskId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      {/* Table Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks by title..."
            value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("title")?.setFilterValue(event.target.value)
            }
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={`px-4 py-2 text-sm  text-gray-950 ${
                      header.id === "description"
                        ? "min-w-[180px]"
                        : header.id === "actions"
                        ? "w-[100px]"
                        : ""
                    }`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? `cursor-pointer select-none flex items-center ${
                                header.column.getIsSorted()
                                  ? "sorted-column"
                                  : ""
                              }`
                            : ""
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getCanSort() && (
                          <div className="ml-2 transition-all duration-200">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="h-4 w-4 text-blue-500" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="h-4 w-4 text-blue-500" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4 opacity-70 hover:opacity-100" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => {
                const task = row.original as TData;
                return (
                  <TableRow
                    key={row.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleRowClick(task.id)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={`px-4 py-2 text-sm text-wrap break-words ${
                          cell.column.id === "description"
                            ? "min-w-[180px] max-w-[400px]"
                            : cell.column.id === "actions"
                            ? "w-[100px]"
                            : ""
                        }`}
                        onClick={(e) => {
                          // Preventing navigation if clicking on actions cell or checkbox
                          if (
                            cell.column.id === "actions" ||
                            cell.column.id === "select"
                          ) {
                            e.stopPropagation();
                          }
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => {
            const task = row.original as TData;
            return (
              <div
                key={row.id}
                className={`border rounded-sm p-2 shadow-sm ${
                  row.getIsSelected() ? "bg-blue-50" : ""
                }`}
              >
                {/* Selection Checkbox for Mobile */}
                <div className="flex items-center justify-between mb-2">
                  <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                      row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                    className="translate-y-0.5"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tasks/edit/${task.id}`);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTaskId(task.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                  <DeleteConfirmationDialog
                    open={deleteTaskId === task.id}
                    onOpenChange={(open) => {
                      if (!open) setDeleteTaskId(null);
                    }}
                    onConfirm={() => {
                      if (deleteTaskId) {
                        deleteTask(deleteTaskId, {
                          onSuccess: () => {
                            setDeleteTaskId(null);
                            // toast.success("Task deleted successfully.");
                          },
                          onError: (error) => {
                            console.log(error);
                            // toast.error("Failed to delete task.");
                          },
                        });
                      }
                    }}
                    title="Delete Task"
                    description="Are you sure you want to delete this task? This action cannot be undone."
                  />
                </div>

                {/* Clickable area for navigation */}
                <div
                  className="cursor-pointer transition-transform rounded-lg shadow-sm p-4 hover:scale-[1.02] hover:shadow-xl"
                  onClick={() => handleRowClick(task.id)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const columnDef = cell.column.columnDef;
                    // Skip actions and checkbox columns in mobile view
                    if (
                      cell.column.id === "actions" ||
                      cell.column.id === "select"
                    )
                      return null;

                    return (
                      <div
                        key={cell.id}
                        className="grid grid-cols-2 border-b last:border-none pb-2 mb-2 gap-4"
                      >
                        <div className="text-sm font-semibold text-gray-600">
                          {columnDef.header as string}:
                        </div>
                        <div className="text-sm text-gray-800">
                          {flexRender(columnDef.cell, cell.getContext())}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="border rounded-lg p-4 text-center">
            No tasks found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(1, table.getPageCount())}
          </span>
          <span>|</span>
          <span>
            {table.getFilteredRowModel().rows.length === 0
              ? "0 task total"
              : table.getFilteredRowModel().rows.length === 1
              ? "1 task total"
              : `${table.getFilteredRowModel().rows.length} tasks total`}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 ">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2 ">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px] text-gray-700">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination buttons */}
          <div className="flex gap-2 text-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              Last
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Columns definition
export const taskColumns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    size: 40,
  },
  {
    id: "rowNumber",
    header: "No.",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600">{row.index + 1}</div>
    ),
    size: 50,
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="title-cell">{row.getValue("title")}</div>
    ),
    size: 200,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="description-cell line-clamp-2">
        {row.getValue("description") || "-"}
      </div>
    ),
    size: 350,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as TaskStatus;
      const statusMap = {
        TODO: { label: "To Do", color: "bg-gray-100 text-gray-700" },
        IN_PROGRESS: {
          label: "In Progress",
          color: "bg-blue-100 text-blue-800",
        },
        DONE: { label: "Done", color: "bg-green-100 text-green-800" },
      };

      return (
        <Badge
          className={`px-2 py-1 text-xs rounded-md ${statusMap[status].color}`}
        >
          {statusMap[status].label}
        </Badge>
      );
    },
    size: 120,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as Date | null;
      return dueDate ? (
        <div className="text-sm text-gray-600">
          {new Date(dueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-600">-</div>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <ActionsCell row={row} />,
    size: 80,
  },
];

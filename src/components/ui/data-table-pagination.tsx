import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
	return (
		<div className="flex space-x-6 lg:space-x-8 my-2 lg:my-0 col-span-2 ">
			<div className="flex items-center w-full lg:w-auto">
				<p className="hidden sm:flex text-sm font-medium w-full">Productos por página</p>
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={value => {
						table.setPageSize(Number(value));
					}}
				>
					<SelectTrigger className="h-8 w-[70px]">
						<SelectValue placeholder={table.getState().pagination.pageSize} />
					</SelectTrigger>
					<SelectContent side="top">
						{[10, 20, 30, 40, 50].map(pageSize => (
							<SelectItem key={pageSize} value={`${pageSize}`}>
								{pageSize}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="hidden sm:flex items-center justify-center text-sm font-medium w-full lg:w-auto">
				{table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
			</div>
			<div className="flex items-center justify-center space-x-2 ">
				<Button
					variant="outline"
					className="flex h-8 w-8 p-0 lg:flex"
					onClick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Ir a la primera página</span>
					<DoubleArrowLeftIcon className="h-6 w-6" />
				</Button>
				<Button
					variant="outline"
					className="h-8 w-8 p-0"
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span className="sr-only">Ir a la última página</span>
					<ChevronLeftIcon className="h-6 w-6" />
				</Button>
				<Button
					variant="outline"
					className="h-8 w-8 p-0"
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Avanzar a la siguiente página</span>
					<ChevronRightIcon className="h-6 w-6" />
				</Button>
				<Button
					variant="outline"
					className="flex h-8 w-8 p-0 lg:flex"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span className="sr-only">Retroceder a la anterior página</span>
					<DoubleArrowRightIcon className="h-6 w-6" />
				</Button>
			</div>
		</div>
	);
}

"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";

import { SelectGroup } from "@radix-ui/react-select";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ui/table";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { DataTablePagination } from "./data-table-pagination";
import { Form, FormControl, FormField, FormItem } from "./form";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";

type SearchKey = {
	value: string;
	label: string;
};
interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKeys: SearchKey[];
}

export function DataTable<TData, TValue>({ columns, data, searchKeys }: DataTableProps<TData, TValue>) {
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		state: {
			columnFilters
		}
	});

	const form = useForm<{ searchKey: string }>({
		defaultValues: {
			searchKey: searchKeys[0].value
		}
	});

	return (
		<div>
			<div className="flex items-center py-4 gap-2">
				<Input
					placeholder="Buscar"
					value={(table.getColumn(form.getValues("searchKey"))?.getFilterValue() as string) ?? ""}
					onChange={event => table.getColumn(form.getValues("searchKey"))?.setFilterValue(event.target.value)}
					className="max-w-sm"
				/>
				<Form {...form}>
					<FormField
						control={form.control}
						name="searchKey"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										value={field.value}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectGroup>
													<SelectValue
														defaultValue={field.value}
														placeholder="Selecciona un tipo de producto"
													/>
												</SelectGroup>
												<SelectContent>
													{searchKeys.map(key => {
														return (
															<SelectItem key={key.value} value={key.value}>
																{key.label}
															</SelectItem>
														);
													})}
												</SelectContent>
											</SelectTrigger>
										</FormControl>
									</Select>
								</FormControl>
							</FormItem>
						)}
					/>
				</Form>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									Sin resultados
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}

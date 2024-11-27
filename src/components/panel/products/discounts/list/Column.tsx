"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { DiscountType } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import CellIdAction from "./CellIdAction";

export type Column = {
	id: string;
	name: string;
	description: string | null;
	type: DiscountType;
	value: string;
	createdAt: string;
};

export const columns: ColumnDef<Column>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: "id",
		header: "Id",
		cell: ({ row }) => <CellIdAction value={row.original.id} />
	},
	{
		accessorKey: "name",
		header: "Descuento"
	},
	{
		accessorKey: "description",
		header: "Descripción"
	},
	{
		accessorKey: "type",
		header: "Tipo",
		cell: ({ row }) => (
			<div className="text-left">
				<span className="text-secondary">{row.original.type === "PERCENTAGE" ? "Porcentaje" : "Monto"}</span>
			</div>
		)
	},
	{
		accessorKey: "value",
		header: "Valor",
		cell: ({ row }) => (
			<div className="text-right">
				<span className="text-primary">{row.original.value}</span>
			</div>
		)
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction discount={row.original} />
	}
];

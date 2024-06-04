"use client";

import type { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import CellIdAction from "./CellIdAction";

export type Column = {
	id: string;
	name: string;
	description: string | null;
	createdAt: string;
};

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "id",
		header: "Id",
		cell: ({ row }) => <CellIdAction product={row.original} />
	},
	{
		accessorKey: "name",
		header: "Marca"
	},
	{
		accessorKey: "description",
		header: "Descripción"
	},
	{
		accessorKey: "createdAt",
		header: "Creado"
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction brand={row.original} />
	}
];

"use client";

import type { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import CellIdAction from "./CellIdAction";

export type Column = {
	id: number;
	name: string;
	price: string;
	stock: number;
	brandName: string;
	weightOrVolume: string;
	available: boolean;
	createdAt: string;
};

export const columns: ColumnDef<Column>[] = [
	{
		accessorKey: "id",
		header: "Id",
		cell: ({ row }) => <CellIdAction value={row.original.id} />
	},
	{
		accessorKey: "name",
		header: "Nombre"
	},
	{
		accessorKey: "brandName",
		header: "Marca"
	},
	{
		accessorKey: "price",
		header: "Precio"
	},
	{
		accessorKey: "weightOrVolume",
		header: "Peso o Volumen"
	},
	{
		accessorKey: "available",
		header: "Disponible"
	},
	{
		accessorKey: "stock",
		header: "Stock"
	},
	{
		accessorKey: "createdAt",
		header: "Creado"
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction product={row.original} />
	}
];

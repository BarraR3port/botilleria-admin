"use client";

import type { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import CellIdAction from "./CellIdAction";
import { Checkbox } from "@/components/ui/checkbox";
import Barcode from "react-barcode";

export type Column = {
	id: string;
	name: string;
	price: string;
	stock: number;
	barcode: string;
	brandName: string;
	weightOrVolume: string;
	available: string;
	createdAt: string;
};

export const columns: ColumnDef<Column>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Seleccionar todos"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Seleccionar producto"
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
		accessorKey: "barcode",
		header: "Código de Barra",
		cell: ({ row }) => <Barcode value={row.original.barcode} format="EAN13" width={2} height={50} fontSize={15} />
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction product={row.original} />
	}
];

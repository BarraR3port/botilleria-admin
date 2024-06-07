"use client";

import MultipleSelector from "@/components/extensions/multiple-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { useBreakpoint } from "@/lib/breakpoint";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import CellAction from "./CellAction";
import CellIdAction from "./CellIdAction";

export type ColumnRef = {
	id: string;
	total: number;
	createdAt: string;
	userId: string;
	user: {
		id: string;
		name: string;
		lastName: string;
		email: string;
	};
	products: {
		id: string;
		quantity: number;
		originalPrice: number;
		appliedDiscount: number;
		productId: number;
		product: {
			id: number;
			name: string;
			sellPrice: number;
		};
	}[];
};

export type Column = {
	id: string;
	total: string | number;
	createdAt: string;
	userId: string;
	sellerName: string;
	sellerEmail: string;
	products: {
		id: string;
		quantity: number;
		originalPrice: string;
		appliedDiscount: string;
		productId: number;
		productName: string;
		productSellPrice: string;
	}[];
};

export const columns: ColumnDef<Column>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllRowsSelected(!!value)}
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
		accessorKey: "total",
		header: "Total"
	},
	{
		accessorKey: "sellerName",
		header: "Venta por",
		cell: ({ row }) => (
			<Link href={`/panel/users/${row.original.userId}`} className="hover:text-blue-500">
				{row.original.sellerName}
			</Link>
		)
	},
	{
		accessorKey: "products",
		header: "Productos",
		cell: ({ row }) => {
			const OPTIONS = row.original.products.map(product => ({
				label: product.productName,
				value: product.productId.toString()
			}));

			const breakpoint = useBreakpoint();

			const maxShownItems = useMemo(() => {
				if (breakpoint === "xs") {
					return 1;
				}
				if (breakpoint === "sm") {
					return 1;
				}

				if (breakpoint === "md") {
					return 2;
				}
				return 6;
			}, [breakpoint]);

			return (
				<MultipleSelector
					className="max-w-[400px] md:max-w-full  overflow-hidden"
					value={OPTIONS}
					defaultOptions={OPTIONS}
					maxShownItems={maxShownItems}
					disabled
					hidePlaceholderWhenSelected
					placeholder="Select frameworks you like..."
					redirectTo="/panel/products/"
					emptyIndicator={
						<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
							no results found.
						</p>
					}
				/>
			);
		}
	},
	{
		accessorKey: "createdAt",
		header: "Creado"
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction sale={row.original} />
	}
];

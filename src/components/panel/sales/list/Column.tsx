"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { ColumnDef } from "@tanstack/react-table";
import CellAction from "./CellAction";
import CellIdAction from "./CellIdAction";
import MultipleSelector from "@/components/extensions/multiple-selector";
import { useBreakpoint } from "@/lib/breakpoint";
import { useCallback, useMemo } from "react";

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
	total: string;
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
		accessorKey: "total",
		header: "Total"
	},
	{
		accessorKey: "sellerName",
		header: "Venta por"
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
		cell: ({ row }) => <CellAction product={row.original} />
	}
];

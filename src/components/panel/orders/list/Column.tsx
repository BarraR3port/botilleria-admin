"use client";

import MultipleSelector from "@/components/extensions/multiple-selector";
import { Checkbox } from "@/components/ui/checkbox";
import { useBreakpoint } from "@/lib/breakpoint";
import type { OrderStatus, Provider } from "@prisma/client";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import CellAction from "./CellAction";
import CellIdAction from "./CellIdAction";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type Column = {
	id: string;
	total: string;
	status: OrderStatus;
	createdAt: string;
	user: string;
	userId: string;
	provider: string | Provider;
	totalUserSales?: number;
	sellerEmail?: string;
	products: {
		id: string;
		quantity: number;
		originalPrice: string;
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
		accessorKey: "user",
		header: "Usuario"
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
					placeholder="Selecciona el producto..."
					redirectTo="/panel/orders/"
					emptyIndicator={
						<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
							No hay productos
						</p>
					}
				/>
			);
		}
	},
	{
		accessorKey: "provider",
		header: "Proveedor"
	},
	{
		accessorKey: "status",
		header: "Estado",
		cell: ({ row }) => {
			const getStatusName = (status: OrderStatus) => {
				switch (status) {
					case "PENDING":
						return "Pendiente";
					case "COMPLETED":
						return "Completado";
					case "CANCELLED":
						return "Cancelado";
				}
			};
			const getStatusVariant = (status: OrderStatus) => {
				switch (status) {
					case "PENDING":
						return "muted";
					case "COMPLETED":
						return "success";
					case "CANCELLED":
						return "destructive";
				}
			};

			return (
				<div className="text-left">
					<Badge variant={getStatusVariant(row.original.status)}>
						{getStatusName(row.original.status)}
					</Badge>
				</div >
			)
		}
	},
	{
		id: "actions",
		cell: ({ row }) => <CellAction product={row.original} />
	}
];

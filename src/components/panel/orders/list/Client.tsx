import { DataTable } from "@ui/data-table";
import { Package, Receipt } from "lucide-react";
import { type Column, columns } from "./Column";

interface ClientProps {
	orders: Column[];
}

export function Client({ orders }: ClientProps) {
	return (
		<DataTable
			columns={columns}
			data={orders}
			searchKeys={SEARCH_KEYS}
			icon={<Receipt className="h-6 w-6" />}
			title="Pedidos"
			mainPath="/panel/orders"
			createButton
		/>
	);
}

const SEARCH_KEYS = [
	{
		value: "user",
		label: "Usuario"
	},
	{
		value: "id",
		label: "Id"
	},
	{
		value: "provider",
		label: "Proveedor"
	},
	{
		value: "status",
		label: "Estado"
	}
];

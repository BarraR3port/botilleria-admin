import { DataTable } from "@ui/data-table";
import { DollarSign } from "lucide-react";
import { type Column, columns } from "./Column";

interface ClientProps {
	sales: Column[];
}

export function Client({ sales }: ClientProps) {
	return (
		<DataTable
			columns={columns}
			data={sales}
			searchKeys={SEARCH_KEYS}
			icon={<DollarSign className="h-6 w-6" />}
			mainPath="/panel/sales"
			title="Ventas"
		/>
	);
}

const SEARCH_KEYS = [
	{
		value: "sellerName",
		label: "Vendedor"
	},
	{
		value: "total",
		label: "Total"
	},
	{
		value: "id",
		label: "Id"
	},
	{
		value: "price",
		label: "Precio"
	}
];

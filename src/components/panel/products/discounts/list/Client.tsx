import { DataTable } from "@ui/data-table";
import { BadgePercent } from "lucide-react";
import { type Column, columns } from "./Column";

interface ClientProps {
	discounts: Column[];
}

export function Client({ discounts }: ClientProps) {
	return (
		<DataTable
			columns={columns}
			data={discounts}
			searchKeys={SEARCH_KEYS}
			icon={<BadgePercent className="h-6 w-6" />}
			title="Descuentos"
			mainPath="/panel/products/discounts"
			createButton
		/>
	);
}

const SEARCH_KEYS = [
	{
		value: "name",
		label: "Descuento"
	},
	{
		value: "type",
		label: "Tipo"
	},
	{
		value: "value",
		label: "Valor"
	},
	{
		value: "description",
		label: "Descripción"
	}
];

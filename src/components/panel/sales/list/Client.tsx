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
		value: "total",
		label: "Total"
	},
	{
		value: "id",
		label: "Id"
	},
	{
		value: "user.name",
		label: "Usuario"
	},
	{
		value: "price",
		label: "Precio"
	},
	{
		value: "weightOrVolume",
		label: "Peso o Volumen"
	},
	{
		value: "available",
		label: "Disponible"
	},
	{
		value: "createdAt",
		label: "Creado"
	}
];

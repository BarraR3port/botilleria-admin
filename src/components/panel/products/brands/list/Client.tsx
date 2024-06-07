import { DataTable } from "@ui/data-table";
import { Tag } from "lucide-react";
import { type Column, columns } from "./Column";

interface ClientProps {
	brands: Column[];
}

export function Client({ brands }: ClientProps) {
	return (
		<DataTable
			columns={columns}
			data={brands}
			searchKeys={SEARCH_KEYS}
			icon={<Tag className="h-6 w-6" />}
			title="Marcas"
			mainPath="/panel/products/brands"
		/>
	);
}

const SEARCH_KEYS = [
	{
		value: "name",
		label: "Marca"
	},
	{
		value: "id",
		label: "Id"
	},
	{
		value: "description",
		label: "Descripción"
	},
	{
		value: "createdAt",
		label: "Creado"
	}
];

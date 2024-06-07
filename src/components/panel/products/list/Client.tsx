import { DataTable } from "@ui/data-table";
import { Package } from "lucide-react";
import { type Column, columns } from "./Column";

interface ClientProps {
	products: Column[];
}

export function Client({ products }: ClientProps) {
	return (
		<DataTable
			columns={columns}
			data={products}
			searchKeys={SEARCH_KEYS}
			icon={<Package className="h-6 w-6" />}
			title="Productos"
			mainPath="/panel/products"
		/>
	);
}

const SEARCH_KEYS = [
	{
		value: "name",
		label: "Nombre"
	},
	{
		value: "id",
		label: "Id"
	},
	{
		value: "brandName",
		label: "Marca"
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

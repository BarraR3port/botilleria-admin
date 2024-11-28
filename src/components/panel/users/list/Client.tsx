import { DataTable } from "@ui/data-table";
import { Users } from "lucide-react";
import { type Column, columns } from "./Column";

interface ClientProps {
	users: Column[];
}

export function Client({ users }: ClientProps) {
	return (
		<DataTable
			columns={columns}
			data={users}
			searchKeys={SEARCH_KEYS}
			title="Usuarios"
			mainPath="/panel/users"
			icon={<Users className="h-6 w-6" />}
			createButton
		/>
	);
}

const SEARCH_KEYS = [
	{
		value: "name",
		label: "Nombre"
	},
	{
		value: "rut",
		label: "Rut"
	},
	{
		value: "rol",
		label: "Rol"
	},
	{
		value: "createdAt",
		label: "Creado"
	}
];

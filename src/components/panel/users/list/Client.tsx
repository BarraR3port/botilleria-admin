"use client";

import { Button } from "@ui/button";
import { DataTable } from "@ui/data-table";
import Heading from "@ui/heading";
import { Separator } from "@ui/separator";
import { Package, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { type Column, columns } from "./Column";

interface ClientProps {
	users: Column[];
}

export function Client({ users }: ClientProps) {
	const router = useRouter();

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Users className="h-6 w-6" />
					<Heading title={"Usuarios"} mainPath="/panel/users" />
				</div>
				<Button
					onClick={() => {
						router.push("/panel/users/new");
					}}
					variant="outline"
				>
					<Plus className="mr-2 w-4 h-4" />
					Crear Producto
				</Button>
			</div>
			<Separator />
			<DataTable columns={columns} data={users} searchKeys={SEARCH_KEYS} />
		</>
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

"use client";

import AlertModal from "@/modals/alert-modal";
import { Button } from "@ui/button";
import { useToast } from "@ui/use-toast";
import axios from "axios";
import { Eye, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Column } from "./Column";
import { handleAxiosResponse } from "@/api/utils";

interface CellActionProps {
	sale: Column;
}

export default function CellAction({ sale }: CellActionProps) {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	function edit() {
		router.push(`/panel/sales/${sale.id}`);
	}

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios
				.delete(`/api/sales/${sale.id}`, {
					headers: {
						Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
					}
				})
				.then(res => handleAxiosResponse(res));
			if (response) {
				toast({
					title: "Venta eliminada correctamente",
					variant: "success",
					duration: 1500
				});
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar la venta de tu tienda",
				variant: "error",
				duration: 1500
			});
		} finally {
			setLoading(false);
			setOpen(false);
		}
	}

	return (
		<>
			<AlertModal open={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<Button variant="ghost" onClick={edit} className="group">
				<Eye className="h-4 w-4 hover:cursor-pointer group-hover:text-blue-500" />
			</Button>
			<Button variant="ghost" onClick={() => setOpen(true)} className="group">
				<Trash className="h-4 w-4 hover:cursor-pointer text-red-500 group-hover:text-white" />
			</Button>
		</>
	);
}

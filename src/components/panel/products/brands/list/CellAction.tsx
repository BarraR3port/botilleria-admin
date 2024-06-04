"use client";

import AlertModal from "@/modals/alert-modal";
import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { useToast } from "@ui/use-toast";
import axios from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Column } from "./Column";

interface CellActionProps {
	brand: Column;
}

export default function CellAction({ brand }: CellActionProps) {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	function edit() {
		router.push(`/panel/products/brands/${brand.id}`);
	}

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/products/brands/${brand.id}`, {
				headers: {
					Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
				}
			});
			if (response?.data) {
				toast({
					title: "Producto eliminado correctamente",
					variant: "success",
					duration: 1500
				});
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar el producto de tu tienda",
				variant: "error",
				duration: 1500
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<AlertModal open={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<div className=" ">
				<Button variant="ghost" onClick={edit}>
					<Edit className="h-4 w-4 hover:cursor-pointer" />
				</Button>
				<Button variant="destructive" onClick={() => setOpen(true)}>
					<Trash className="h-4 w-4 hover:cursor-pointer" />
				</Button>
			</div>
		</>
	);
}

"use client";

import AlertModal from "@/modals/alert-modal";
import { Button } from "@ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@ui/dropdown-menu";
import { useToast } from "@ui/use-toast";
import axios from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import type { Column } from "./Column";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";

interface CellActionProps {
	product: Column;
}

export default function CellAction({ product }: CellActionProps) {
	const { data: session } = useSession();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const { toast } = useToast();

	function edit() {
		router.push(`/panel/products/${product.id}`);
	}

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/products/${product.id}`, {
				headers: {
					Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
				}
			});
			if (response?.data) {
				toast({
					title: "Producto eliminado correctamente",
					variant: "success"
				});
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar el producto de tu tienda",
				variant: "error"
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<AlertModal open={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						<span className="sr-only">Abrir menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="min-w-4">
					<DropdownMenuItem onClick={edit}>
						<Edit className="h-4 w-4 hover:cursor-pointer" />
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="h-4 w-4 hover:cursor-pointer" />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

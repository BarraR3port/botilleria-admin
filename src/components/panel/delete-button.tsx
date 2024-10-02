"use client";

import AlertModal from "@/modals/alert-modal";
import axios from "axios";
import { Trash } from "lucide-react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

interface DeleteButtonProps {
	type: "products" | "sales" | "users" | "products/brands" | "products/discounts" | "orders";
	session: Session | null;
	itemId: number | string;
}

export default function DeleteButton({ type, session, itemId }: DeleteButtonProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/${type}/${itemId}`, {
				headers: {
					Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
				}
			});
			if (response?.data) {
				toast({
					title: "Eliminado correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace(`/panel/${type}`);
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar",
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
			<AlertModal
				open={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
				type="cancelAndConfirm"
			/>
			<Button
				variant="ghost"
				className="group"
				onClick={() => {
					setOpen(true);
				}}
			>
				<Trash className="h-4 w-4 hover:cursor-pointer text-red-500" />
				<span className="sr sr-only">Eliminar</span>
			</Button>
		</>
	);
}

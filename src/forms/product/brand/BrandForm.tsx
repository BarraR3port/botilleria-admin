"use client";

import { handleAxiosResponse } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import AlertModal from "@/modals/alert-modal";
import type { AuthResponse } from "@/objects";
import { BrandFormSchema, type BrandFormType } from "@/schemas/BrandSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Brand } from "@prisma/client";
import axios from "axios";
import { Plus, Save, Tag, Trash } from "lucide-react";
import type { Session } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface BrandProps {
	brand: Brand | null;
	session: Session;
}

export default function ProductForm({ brand, session }: BrandProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const params = useParams();
	const router = useRouter();

	const title = brand ? "Editar Marca" : "Crear Marca";
	const toastDescription = brand ? "Marca editada correctamente" : "Marca creada correctamente";

	const form = useForm<BrandFormType>({
		resolver: yupResolver(BrandFormSchema),
		defaultValues: brand
			? {
					name: brand.name || "",
					description: brand.description || ""
				}
			: {
					name: "",
					description: ""
				}
	});

	const onSubmit = async (data: BrandFormType) => {
		setLoading(true);
		try {
			const response = brand
				? await axios
						.patch(`/api/products/brands/${params.brandId}`, data, {
							headers: {
								Authorization: `Bearer ${session.user.backendTokens.accessToken.token}`
							}
						})
						.catch((error: AuthResponse) => {
							if (!error) return null;

							if (typeof error === "object" && "response" in error && "data" in error.response) {
								if ("errors" in error.response.data) {
									error.response.data.errors.forEach(errorMessage => {
										form.setError(errorMessage.type as any, { message: errorMessage.message });
										toast({
											title: errorMessage.message,
											variant: "destructive",
											duration: 1500
										});
									});
								}
								return null;
							}
						})
						.then(handleAxiosResponse)
				: await axios
						.post("/api/products/brands", data, {
							headers: {
								Authorization: `Bearer ${session.user.backendTokens.accessToken.token}`
							}
						})
						.catch((error: AuthResponse) => {
							if (!error) return null;

							if (typeof error === "object" && "response" in error && "data" in error.response) {
								if ("errors" in error.response.data) {
									error.response.data.errors.forEach(errorMessage => {
										form.setError(errorMessage.type as any, { message: errorMessage.message });
										toast({
											title: errorMessage.message,
											variant: "destructive",
											duration: 1500
										});
									});
								}
								return null;
							}
						})
						.then(handleAxiosResponse);

			if (response) {
				toast({
					title: toastDescription,
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/products/brands");
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al guardar los ajustes",
				variant: "error",
				duration: 1500
			});
		} finally {
			setLoading(false);
		}
	};

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/products/brands/${params.brandId}`, {
				headers: {
					Authorization: `Bearer ${session.user.backendTokens.accessToken.token}`
				}
			});
			if (response?.data) {
				toast({
					title: "Marca eliminada correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/products/brands");
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar la producto de tu tienda",
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
			<div className="flex items-center justify-between">
				<Heading title={title} />
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full flex-col">
					<div className="space-y-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loading}
												placeholder="Nombre de la marca"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Descripción (opcional)</FormLabel>
										<FormControl>
											<Textarea placeholder="Descripción de la marca" {...field} />
										</FormControl>

										<FormDescription>
											La descripción debe tener al menos 4 caracteres y no más de 1024 caracteres.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex gap-2 justify-end">
						{brand && (
							<Button
								className="h-8 gap-1 "
								variant="destructive"
								onClick={() => {
									setOpen(true);
								}}
							>
								<Trash className="h-4 w-4" />
								<span>Eliminar</span>
							</Button>
						)}

						<Button className="h-8 gap-1" type="submit" variant="success" loading={loading}>
							{brand ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
							{brand ? "Guardar" : "Crear"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}

"use client";

import { handleAxiosResponse } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import AlertModal from "@/modals/alert-modal";
import type { ApiResponse, AuthResponse } from "@/objects";
import { DiscountFormSchema, type DiscountFormType } from "@/schemas/DiscountSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Discount } from "@prisma/client";
import axios from "axios";
import { Plus, Save, Trash } from "lucide-react";
import type { Session } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface BrandProps {
	discount: Discount | null;
	session: Session;
	types: {
		value: string;
		label: string;
	}[];
}

export default function DiscountForm({ discount, session, types }: BrandProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const params = useParams();
	const router = useRouter();

	const title = discount ? "Editar Descuento" : "Crear Descuento";
	const toastDescription = discount ? "Descuento editada correctamente" : "Descuento creada correctamente";

	const form = useForm<DiscountFormType>({
		resolver: yupResolver(DiscountFormSchema),
		defaultValues: discount
			? {
					name: discount.name || "",
					description: discount.description || "",
					type: discount.type,
					value: discount.value,
					active: discount.active
				}
			: {
					name: "",
					description: "",
					type: "PERCENTAGE",
					value: 0,
					active: true
				}
	});

	const onSubmit = async (data: DiscountFormType) => {
		setLoading(true);
		try {
			const response = discount
				? await axios
						.patch(`/api/sales/discounts/${params.discountId}`, data, {
							headers: {
								Authorization: `Bearer ${session.user.backendTokens.accessToken.token}`
							}
						})
						.then(response => handleAxiosResponse(response, form))
				: await axios
						.post("/api/sales/discounts", data, {
							headers: {
								Authorization: `Bearer ${session.user.backendTokens.accessToken.token}`
							}
						})
						.then(response => handleAxiosResponse(response, form));

			if (response) {
				toast({
					title: toastDescription,
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/sales/discounts");
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
			const response = await axios.delete(`/api/sales/discounts/${params.discountId}`, {
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
				router.replace("/panel/sales/discounts");
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
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo del descuento</FormLabel>
										<FormControl>
											<Select
												disabled={loading}
												onValueChange={field.onChange}
												value={field.value}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															defaultValue={field.value}
															placeholder="Selecciona un tipo de producto"
														/>
														<SelectContent>
															{types.map(type => {
																return (
																	<SelectItem key={type.value} value={type.value}>
																		{type.label}
																	</SelectItem>
																);
															})}
														</SelectContent>
													</SelectTrigger>
												</FormControl>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="value"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Valor</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loading}
												placeholder="10000"
												type="number"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="active"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Disponible</FormLabel>
											<FormDescription>
												Activa o desactiva este descuento de la botillería
											</FormDescription>
										</div>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

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
					<div className="flex gap-2 justify-end">
						{discount && (
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
							{discount ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
							{discount ? "Guardar" : "Crear"}
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}

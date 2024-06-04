"use client";

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
import { ProductFormSchema, type ProductFormType } from "@/schemas/ProductSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Brand, Product, ProductType } from "@prisma/client";
import axios from "axios";
import { Trash } from "lucide-react";
import type { Session } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormProps {
	product: Product | null;
	brands: Brand[];
	types: {
		value: string;
		label: string;
	}[];
	session: Session;
}

export default function ProductForm({ product, brands, types, session }: FormProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const params = useParams();
	const router = useRouter();

	const title = product ? "Editar Producto" : "Crear Producto";
	const description = product ? "Edita la producto de tu tienda" : "Crea una producto para tu tienda";
	const toastDescription = product ? "Producto editada correctamente" : "Producto creada correctamente";
	const actionMessage = product ? "Guardar cambios" : "Crear";

	const form = useForm<ProductFormType>({
		resolver: yupResolver(ProductFormSchema),
		defaultValues: product
			? {
					...product,
					sellPrice: Number.parseFloat(String(product?.sellPrice)),
					costPrice: Number.parseFloat(String(product?.costPrice))
				}
			: {
					name: "",
					description: "",
					stock: 0,
					sellPrice: 0,
					costPrice: 0,
					weightOrVolume: 0,
					brandId: "",
					type: types[0].value as ProductType,
					available: true
				}
	});

	const onSubmit = async (data: ProductFormType) => {
		setLoading(true);
		try {
			const response = product
				? await axios.patch(`/api/products/${params.productId}`, data, {
						headers: {
							Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
						}
					})
				: await axios.post("/api/products", data, {
						headers: {
							Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
						}
					});

			if (response?.data) {
				toast({
					title: toastDescription,
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/products");
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al guardar los ajustes",
				variant: "error"
			});
		} finally {
			setLoading(false);
		}
	};

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/products/${params.productId}`);
			if (response?.data) {
				toast({
					title: "Producto eliminada correctamente",
					variant: "success"
				});
				router.replace("/products");
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar la producto de tu tienda",
				variant: "error"
			});
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<AlertModal open={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{product && (
					<Button
						variant="destructive"
						size={"sm"}
						onClick={() => {
							setOpen(true);
						}}
					>
						<Trash className="h-4 w-4" />
					</Button>
				)}
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
												placeholder="Nombre de la producto"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="stock"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Stock</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loading}
												placeholder="0"
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
								name="sellPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Precio de Venta</FormLabel>
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
								name="costPrice"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Precio de Coste</FormLabel>
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
								name="weightOrVolume"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Peso o Volumen del producto</FormLabel>
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
								name="brandId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Marca</FormLabel>
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
															placeholder="Selecciona una marca"
														/>
														<SelectContent>
															{brands.map(brand => {
																return (
																	<SelectItem key={brand.id} value={brand.id}>
																		{brand.name}
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
								name="type"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Tipo del producto</FormLabel>
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
								name="available"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Disponible</FormLabel>
											<FormDescription>
												Activa o desactiva este producto de la botillería
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
									<FormLabel>Descripción</FormLabel>
									<FormControl>
										<Textarea placeholder="Descripción del producto" {...field} />
									</FormControl>

									<FormDescription>
										La descripción debe tener al menos 4 caracteres y no más de 1024 caracteres.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button type="submit" variant="success" loading={loading} className="w-[200px]">
						{actionMessage}
					</Button>
				</form>
			</Form>
		</>
	);
}

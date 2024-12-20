"use client";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import AlertModal from "@/modals/alert-modal";
import { ProductFormSchema, type ProductFormType } from "@/schemas/ProductSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Brand, Discount, Product, ProductType, Provider } from "@prisma/client";
import axios from "axios";
import { Plus, Save, Trash } from "lucide-react";
import type { Session } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Barcode from "react-barcode";
import { useForm } from "react-hook-form";

interface FormProps {
	product: Product | null;
	brands: Brand[];
	providers: Provider[];
	discounts: Discount[];
	types: {
		value: string;
		label: string;
	}[];
	session: Session;
}

export default function ProductForm({ product, providers, brands, discounts, types, session }: FormProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const params = useParams();
	const router = useRouter();

	const title = product ? "Editar Producto" : "Crear Producto";
	const toastDescription = product ? "Producto editada correctamente" : "Producto creada correctamente";

	const form = useForm<ProductFormType>({
		resolver: yupResolver(ProductFormSchema),
		defaultValues: product
			? {
				...product,
				sellPrice: Number.parseFloat(String(product?.sellPrice)),
				costPrice: Number.parseFloat(String(product?.costPrice)),
				description: product?.description || "",
				discountId: product?.discountId || undefined,
				brandId: product?.brandId || brands[0].id,
				providerId: product?.providerId || providers[0]?.id
			}
			: {
				name: "",
				description: "",
				stock: 0,
				sellPrice: 0,
				costPrice: 0,
				weightOrVolume: 0,
				brandId: brands[0]?.id,
				discountId: undefined,
				type: types[0].value as ProductType,
				available: true,
				barcode: "100000000000",
				providerId: providers[0]?.id
			}
	});

	const onSubmit = async (data: ProductFormType) => {
		setLoading(true);
		try {
			const response = product
				? await axios
					.patch(
						`/api/products/${params.productId}`,
						{
							...data,
							discountId:
								typeof data?.discountId === "number" && data?.discountId === -1
									? undefined
									: data.discountId,
							providerId: data?.providerId || providers[0]?.id
						},
						{
							headers: {
								Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
							}
						}
					)
					.catch(res => catchAxiosResponse(res, form))
					.then(res => handleAxiosResponse(res, form))
				: await axios
					.post(
						"/api/products",
						{
							...data,
							discountId:
								typeof data?.discountId === "number" && data?.discountId === -1
									? undefined
									: data.discountId,
							providerId: data?.providerId || providers[0]?.id
						},
						{
							headers: {
								Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
							}
						}
					)
					.catch(res => catchAxiosResponse(res, form))
					.then(res => handleAxiosResponse(res, form));

			if (response) {
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
			const response = await axios.delete(`/api/products/${params.productId}`);
			if (response?.data) {
				toast({
					title: "Producto eliminado correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/products");
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
			setOpen(false);
		}
	}

	return (
		<>
			<AlertModal open={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
			<div className="sm:flex items-center justify-between space-y-4">
				<Heading title={title} mainPath="products/" />
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
					<Card>
						<CardHeader>
							<CardTitle>Ingresa los datos de tu producto</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
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
										name="providerId"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Proveedor</FormLabel>
												<FormControl>
													<Select
														disabled={loading}
														onValueChange={field.onChange}
														value={`${field.value}`}
														defaultValue={`${field.value}`}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	defaultValue={field.value}
																	placeholder="Selecciona una marca"
																/>
																<SelectContent>
																	{providers.map(provider => {
																		return (
																			<SelectItem
																				key={provider.id}
																				value={`${provider.id}`}
																			>
																				{provider.name}
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
										name="discountId"
										render={({ field }) => (
											<FormItem>
												<FormLabel optional>Descuento</FormLabel>
												<FormControl>
													<Select
														disabled={loading}
														onValueChange={field.onChange}
														value={field.value?.toString()}
														defaultValue={field.value?.toString()}
													>
														<FormControl>
															<SelectTrigger>
																<SelectValue
																	defaultValue={field.value}
																	placeholder="Selecciona un descuento"
																/>
																<SelectContent>
																	{discounts.map(discount => {
																		return (
																			<SelectItem
																				key={discount.id}
																				value={discount.id.toString()}
																			>
																				{discount.name}
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
											<FormItem className="relative flex w-full items-start gap-2 rounded-lg border border-input p-4 shadow-sm shadow-black/5 has-[[data-state=checked]]:border-ring">
												<FormControl>
													<div className="">
														<Checkbox
															id="checkbox-13"
															className="order-1 after:absolute after:inset-0"
															aria-describedby="checkbox-13-description"
															checked={field.value} onCheckedChange={field.onChange}
														/>
														<div className="grid grow gap-2">
															<Label htmlFor="checkbox-13">
																Disponible
															</Label>
														</div>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
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
									<FormField
										control={form.control}
										name="barcode"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Código de Barras</FormLabel>
												<div className="space-y-2">
													<Barcode
														value={field.value}
														format="EAN13"
														width={2}
														height={50}
														fontSize={15}
													/>
													<>
														<FormControl>
															<Input
																className="w-[233.98px]"
																autoComplete="off"
																disabled={loading}
																placeholder="00000000000000"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</>
												</div>
											</FormItem>
										)}
									/>
								</div>
							</div>
						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="destructive" type="button" onClick={() => {
								if (product) {
									setOpen(true);
									return;
								}
								router.push("/panel/products")
							}}>
								{product ? "Eliminar producto" : "Cancelar"}
							</Button>
							<Button type="submit" disabled={loading}>
								{product ? "Actualizar producto" : "Crear producto"}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</>
	);
}

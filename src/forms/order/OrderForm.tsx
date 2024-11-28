"use client";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { ProductSelector } from "@/app/(admin)/panel/orders/create/ProductSelector";
import { ProviderSelector } from "@/app/(admin)/panel/orders/create/ProviderSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { priceFormatter } from "@/lib/utils";
import AlertModal from "@/modals/alert-modal";
import { OrderFormSchema, type OrderFormType } from "@/schemas/OrderSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Order, OrderItem, Product, Provider } from "@prisma/client";
import axios from "axios";
import type { Session } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";

export type OrderProduct = Product & {
	brand: {
		id: string;
		name: string;
	};
};

export type OrderProvider = Provider & {
	products: OrderProduct[];
};

type CustomOrderItem = OrderItem & { name: string, costPrice: number };

export type CustomOrder = Order & {
	products: CustomOrderItem[];
};

interface OrderProps {
	providers: OrderProvider[];
	session: Session;
	order?: CustomOrder;
}

export default function OrderForm({ providers, session, order }: OrderProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [displayedProducts, setDisplayedProducts] = useState<OrderProduct[]>(
		order
			? (providers.find(provider => provider.id === order.providerId)?.products ?? [])
			: (providers[0]?.products ?? [])
	);
	const { toast } = useToast();
	const params = useParams<{ orderId: string }>();
	const router = useRouter();

	const [quantity, setQuantity] = useState<number>(1);
	const [productSearch, setProductSearch] = useState("");

	const title = order ? "Editar pedido" : "Crear pedido";
	const toastDescription = order ? "Pedido editado correctamente" : "Pedido creado correctamente";

	const form = useForm<OrderFormType>({
		resolver: yupResolver(OrderFormSchema),
		// @ts-ignore
		defaultValues: order
			? {
				...order,
				total: Number.parseFloat(String(order.total)),
				totalWithVAT: Number.parseFloat(String(order.totalWithVAT)),
				providerId: order.providerId || providers[0]?.id,
				createdAt: new Date(order.createdAt),
				updatedAt: new Date(order.updatedAt),
				products: order.products || []
			}
			: {
				total: 0,
				totalWithVAT: 0,
				status: "COMPLETED",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				userId: session?.user.id,
				providerId: providers[0]?.id,
				products: []
			}
	});
	form.watch();

	const addProduct = useCallback(
		(productId: number | undefined) => {
			const currentProduct = displayedProducts.find(item => item.id === productId);

			if (currentProduct && quantity > 0 && providers) {
				const products = form.getValues("products") || [];
				const existingItemIndex = products.findIndex(item => item.productId === currentProduct.id);
				let newProducts: CustomOrderItem[];

				if (existingItemIndex !== -1) {
					// Si el producto ya existe, actualiza su cantidad y precios
					const existingProduct = products[existingItemIndex];
					const updatedProduct = {
						...existingProduct,
						quantity: existingProduct.quantity + quantity,
						priceWithoutVAT: (existingProduct.quantity + quantity) * currentProduct.costPrice,
						priceWithVAT: (existingProduct.quantity + quantity) * currentProduct.costPrice * (1)
					};
					newProducts = [
						...products.slice(0, existingItemIndex),
						updatedProduct,
						...products.slice(existingItemIndex + 1)
					] as any;
				} else {
					// Si es un producto nuevo, agrégalo a la lista
					const newItem = {
						id: Date.now(),
						name: currentProduct.name,
						orderId: order?.id || Date.now(),
						productId: currentProduct.id,
						quantity: quantity,
						priceWithoutVAT: currentProduct.costPrice * quantity,
						priceWithVAT: currentProduct.costPrice * quantity * (1),
						costPrice: currentProduct.costPrice
					};
					newProducts = [...products, newItem] as any;
				}

				form.setValue("products", newProducts);
				setQuantity(1);
				setProductSearch("");

				// Actualizar totales
				const totalWithoutVAT = newProducts.reduce((sum, item) => sum + item.priceWithoutVAT, 0);
				const totalWithVAT = newProducts.reduce((sum, item) => sum + item.priceWithVAT, 0);

				form.setValue("total", totalWithoutVAT);
				form.setValue("totalWithVAT", totalWithVAT);
			}
		},
		[quantity, providers, displayedProducts, order, form]
	);

	const removeProduct = useCallback(
		(id: number) => {
			const products = form.getValues("products") || [];
			const newProducts = products.filter(item => item.id !== id);
			form.setValue("products", newProducts);

			// Actualizar totales
			const totalWithoutVAT = newProducts.reduce((sum, item) => sum + item.priceWithoutVAT, 0);
			const totalWithVAT = newProducts.reduce((sum, item) => sum + item.priceWithVAT, 0);

			form.setValue("total", totalWithoutVAT);
			form.setValue("totalWithVAT", totalWithVAT);
		},
		[form]
	);

	const editProduct = (id: number) => {
		router.push(`/panel/products/edit/${id}`);
	};

	const updateDisplayedProducts = useCallback(() => {
		const providerId = form.getValues("providerId");
		if (!providerId) return;
		const products = providers.find(provider => provider.id === providerId)?.products;
		if (!products) return;
		setDisplayedProducts(products);
	}, [form, providers]);

	const onSubmit = useCallback(
		async (data: OrderFormType) => {
			setLoading(true);
			try {
				const products = form.getValues("products") || [];
				const total = products.reduce((sum, item) => sum + item.priceWithoutVAT, 0);
				const totalWithVAT = products.reduce((sum, item) => sum + item.priceWithVAT, 0);

				const orderData = {
					...data,
					providerId: form.getValues("providerId"),
					total: total,
					totalWithVAT: totalWithVAT,
					products: products.map(item => ({
						productId: item.productId,
						quantity: item.quantity,
						priceWithoutVAT: item.priceWithoutVAT,
						priceWithVAT: item.priceWithVAT
					}))
				};

				const response = order
					? await axios
						.patch(
							`/api/orders/${params.orderId}`,
							{
								...orderData
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
							"/api/orders",
							{
								...orderData
							},
							{
								headers: {
									Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
								}
							}
						)
						.catch(res => catchAxiosResponse(res, form))
						.then(res => handleAxiosResponse(res, form));
				console.log("Order data", JSON.stringify(orderData), response);

				// Aquí iría tu lógica para enviar los datos al backend con axios

				if (response) {
					toast({
						title: toastDescription,
						variant: "success",
						duration: 1500
					});
					router.replace("/panel/orders");
					router.refresh();
				}
			} catch (error) {
				console.error(error);
				toast({
					title: "Ocurrió un error al guardar el pedido",
					variant: "error",
					duration: 1500
				});
			} finally {
				setLoading(false);
			}
		},
		[form, toast, router, toastDescription]
	);

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/orders/${params.orderId}`);
			if (response?.data) {
				toast({
					title: "Pedido eliminado correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/orders");
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar el pedido",
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
							<CardTitle>Ingresa los datos de tu pedido</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Estado</FormLabel>
										<Select onValueChange={field.onChange} defaultValue={field.value}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Seleccionar estado" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="COMPLETED">Completado</SelectItem>
												<SelectItem value="PENDING">Pendiente</SelectItem>
												<SelectItem value="CANCELLED">Cancelado</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="providerId"
								render={({ field }) => {
									const selectedProvider = providers.find(provider => provider.id === field.value);

									return (
										<>
											<FormItem >
												<FormLabel>Proveedor</FormLabel>
												<FormControl>
													<div className="flex ">
														<ProviderSelector
															providers={providers}
															setValue={form.setValue}
															selectedProvider={selectedProvider}
															updateDisplayedProducts={updateDisplayedProducts}
														/>
													</div>
												</FormControl>
												<FormMessage />
											</FormItem>
											{selectedProvider && (
												<FormField
													control={form.control}
													name="productId"
													render={({ field }) => {
														const filteredProducts =
															displayedProducts.filter(product =>
																product.name
																	.toLowerCase()
																	.includes(productSearch.toLowerCase())
															) ?? [];
														const selectedProduct = filteredProducts.find(
															product => product.id === field.value
														);
														return (
															<div className="space-y-4">
																<FormLabel>Agregar Producto</FormLabel>
																<div className="flex space-x-2">
																	<ProductSelector
																		products={filteredProducts}
																		setValue={form.setValue}
																		selectedProduct={selectedProduct}
																		providers={providers}
																	/>

																	<Input
																		type="number"
																		value={quantity}
																		onChange={e =>
																			setQuantity(Number(e.target.value))
																		}
																		min="1"
																		className="w-24"
																	/>
																	<Button
																		type="button"
																		onClick={() => {
																			addProduct(field.value);
																		}}
																	>
																		Agregar
																	</Button>
																</div>
															</div>
														);
													}}
												/>
											)}
										</>
									);
								}}
							/>

							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Id</TableHead>
										<TableHead>Producto</TableHead>
										<TableHead>Cantidad</TableHead>
										<TableHead>Precio Unitario</TableHead>
										<TableHead>Precio final</TableHead>
										<TableHead>Acciones</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{form.getValues("products")?.map(item => (
										<TableRow key={item.id}>
											<TableCell>{item.productId}</TableCell>
											<TableCell>{item.name}</TableCell>
											<TableCell>{item.quantity}</TableCell>
											<TableCell>{priceFormatter.format(item.costPrice)}</TableCell>
											<TableCell>{priceFormatter.format(item.priceWithoutVAT)}</TableCell>
											<TableCell className="space-x-2">
												<Button
													variant="outline"
													size="sm"
													type="button"
													onClick={() => editProduct(item.productId)}
												>
													Editar
												</Button>
												<Button
													variant="destructive"
													size="sm"
													type="button"
													onClick={() => {
														removeProduct(item.id);
													}}
												>
													Eliminar
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<div className="flex justify-end">
								<div>Total: {priceFormatter.format(form.getValues("total") ?? 0)}</div>
							</div>

						</CardContent>
						<CardFooter className="flex justify-between">
							<Button variant="destructive" type="button" onClick={() => router.push("/panel/orders")}>
								Cancelar
							</Button>
							<Button type="submit" disabled={loading}>
								{order ? "Actualizar pedido" : "Crear pedido"}
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</>
	);
}

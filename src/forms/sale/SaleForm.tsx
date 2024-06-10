"use client";
import type { Column } from "@/components/panel/sales/list/Column";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import AlertModal from "@/modals/alert-modal";
import axios from "axios";
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon, Eye, TrashIcon } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface SaleFormProps {
	sale: Column;
	session: Session;
}

export default function SaleForm({ sale, session }: SaleFormProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const params = useParams();

	function openProduct(productId: string) {
		router.push(`/panel/products/${productId}`);
	}

	async function onDelete() {
		setLoading(true);
		try {
			const response = await axios.delete(`/api/sales/${params.saleId}`, {
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
				router.replace("/panel/products/discounts");
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
			<div className="sticky top-0 bg-background z-10 space-y-2">
				<div className="flex items-center justify-between">
					<Heading
						title={
							<h1 className="font-semibold text-lg md:text-xl">
								Venta #{sale.id} -{" "}
								<span className="font-normal text-gray-500 dark:text-gray-400">{sale.sellerName}</span>
								<span className="font-normal text-gray-500 dark:text-gray-400">
									el {sale.createdAt}
								</span>
							</h1>
						}
					/>
				</div>
				<Separator className="pt-2" />
			</div>
			<div className="flex flex-1 flex-col gap-4 md:gap-8 md:p-6">
				<div className="flex flex-col md:grid md:grid-cols-6 gap-6">
					<div className="md:col-span-4 lg:col-span-3 xl:col-span-4 flex flex-col gap-6">
						<Card>
							<CardHeader>
								<CardTitle>Productos</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="max-w-[150px]">Nombre</TableHead>
											<TableHead>Cantidad</TableHead>
											<TableHead>Precio Original</TableHead>
											<TableHead>Descuento</TableHead>
											<TableHead>Precio final</TableHead>
											<TableHead />
										</TableRow>
									</TableHeader>
									<TableBody>
										{sale.products.map(product => (
											<TableRow key={product.id}>
												<TableCell className="font-medium">{product.productName}</TableCell>
												<TableCell>{product.quantity}</TableCell>
												<TableCell>{product.originalPrice}</TableCell>
												<TableCell>{product.appliedDiscount}</TableCell>
												<TableCell>{product.productSellPrice}</TableCell>
												<TableCell className="hidden md:table-cell">
													<Button
														variant="outline"
														size="icon"
														onClick={() => {
															openProduct(product.id);
														}}
													>
														<Eye className="h-4 w-4 hover:cursor-pointer group-hover:text-blue-500" />
														<span className="sr-only">Ver Producto</span>
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Pago</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-4">
								<div className="flex items-center">
									<div>Subtotal</div>
									<div className="ml-auto">$169.00</div>
								</div>
								<div className="flex items-center">
									<div>Descuento</div>
									<div className="ml-auto">-$19.00</div>
								</div>
								<Separator />
								<div className="flex items-center font-medium">
									<div>Total</div>
									<div className="ml-auto">$150.00</div>
								</div>
							</CardContent>
							{/* <CardFooter className="flex items-center gap-2">
								<Button size="sm">Collect payment</Button>
								<Button variant="outline" size="sm">
									Send invoice
								</Button>
							</CardFooter> */}
						</Card>
					</div>
					<div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
						<Card>
							<div>
								<CardHeader className="flex flex-row items-center space-y-0">
									<CardTitle>Vendedor</CardTitle>
									{/* <Button variant="secondary" className="ml-auto">
										Editar
									</Button> */}
								</CardHeader>
								<CardContent className="text-sm">
									<div className="grid gap-1">
										<Link href={`/panel/users/${sale.userId}`} className="text-blue-600 underline">
											{sale.sellerName}
										</Link>
										<div>23 total orders</div>
									</div>
								</CardContent>
							</div>
							<Separator />
							<div>
								<CardHeader>
									<CardTitle>Información de contacto</CardTitle>
								</CardHeader>
								<CardContent className="text-sm">
									<div className="grid gap-1">
										<Link href={`mailto:${sale.sellerEmail}`} className="text-blue-600">
											{sale.sellerEmail}
										</Link>
										{/* <div className="text-gray-500 dark:text-gray-400">+1 888 8888 8888</div> */}
									</div>
								</CardContent>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}

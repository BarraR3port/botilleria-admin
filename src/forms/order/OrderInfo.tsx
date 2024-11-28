"use client";
import type { Column } from "@/components/panel/orders/list/Column";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import AlertModal from "@/modals/alert-modal";
import axios from "axios";
import { Check, CheckCircle, CircleAlert, CircleX, CreditCard, DollarSignIcon, Eye } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

interface OrderInfoProps {
	order: Column;
	session: Session;
}

export default function OrderInfo({ order, session }: OrderInfoProps) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const params = useParams();

	function openProduct(productId: number) {
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
					title: "Venta eliminada correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/sales");
				setOpen(false);
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
			<div className="sticky top-0 z-10">
				<div className="flex items-center justify-between ">
					<Heading
						title={
							<h1 className="font-semibold text-lg md:text-xl text-primary">
								Pedido #{order.id}
								<span className="font-normal text-muted">
									{" "}
									{order.user} el <span className="text-secondary">{order.createdAt}</span>
								</span>
							</h1>
						}
						mainPath="/panel/sales"
					/>
				</div>
				<Separator className="pt-2" />
			</div>
			<div className="flex flex-1 flex-col ">
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
											<TableHead>Precio de coste</TableHead>
											<TableHead />
										</TableRow>
									</TableHeader>
									<TableBody>
										{order.products.map(product => (
											<TableRow key={product.id}>
												<TableCell className="font-medium">{product.productName}</TableCell>
												<TableCell>{product.quantity}</TableCell>
												<TableCell className="text-green-400">
													{product.productSellPrice}
												</TableCell>
												<TableCell className="hidden md:table-cell">
													<Button
														variant="outline"
														size="icon"
														onClick={() => {
															openProduct(product.productId);
														}}
													>
														<Eye className="h-6 w-6 hover:cursor-pointer group-hover:text-blue-500" />
														<span className="sr-only">Ver Producto</span>
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
								<Separator />
								<div className="flex items-center font-medium pt-4">
									<div>Total</div>
									<div className="ml-auto text-green-500">{order.total}</div>
								</div>
							</CardContent>
						</Card>
					</div>
					<div className="md:col-span-2 lg:col-span-3 xl:col-span-2 flex flex-col gap-6">
						<Card>
							<div>
								<CardHeader className="flex flex-row items-center space-y-0">
									<CardTitle>Usuario</CardTitle>
									{/* <Button variant="secondary" className="ml-auto">
										Editar
									</Button> */}
								</CardHeader>
								<CardContent className="text-sm">
									<div className="grid gap-1">
										<Link href={`/panel/users/${order.userId}`} className="text-blue-600 underline">
											{order.user}
										</Link>
										<div>{order.totalUserSales} pedidos este mes</div>
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
										<Link href={`mailto:${order.sellerEmail}`} className="text-blue-600">
											{order.sellerEmail}
										</Link>
										{/* <div className="text-gray-400">+1 888 8888 8888</div> */}
									</div>
								</CardContent>
							</div>
							<Separator />
							<div>
								<CardHeader className="flex flex-row items-center space-y-0">
									<CardTitle>Estado del pedido</CardTitle>
								</CardHeader>
								<CardContent >
									<Badge className="flex items-center space-x-2"
										variant={
											order.status === "PENDING" ? "muted" :
												order.status === "COMPLETED" ? "success" :
													order.status === "CANCELLED" ? "destructive" :
														"default"
										}
									>
										{order.status === "PENDING" && (
											<>
												<CircleAlert className="w-6 h-6" />
												<span className="text-xl">Pendiente</span>
											</>
										)}
										{order.status === "COMPLETED" && (
											<>
												<CheckCircle className="w-6 h-6" />
												<span className="text-xl">Completado</span>
											</>
										)}
										{order.status === "CANCELLED" && (
											<>
												<CircleX className="w-6 h-6" />
												<span className="text-xl">Cancelado</span>
											</>
										)}
									</Badge>
								</CardContent>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</>
	);
}

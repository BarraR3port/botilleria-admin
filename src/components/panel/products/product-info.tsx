import BarCode from "@/components/ui/bar-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { cn, getType, priceFormatter } from "@/lib/utils";
import type { Brand, Product } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Beer, Edit, Utensils } from "lucide-react";
import type { Session } from "next-auth";
import Link from "next/link";
import DeleteButton from "../delete-button";

interface ProductInfoProps {
	product: Product &
	Partial<{
		brand: Brand;
	}>;
	types: {
		value: string;
		label: string;
	}[];
	session: Session;
}

export default function ProductInfo({ product, types, session }: ProductInfoProps) {
	const sellPriceFormatted = priceFormatter.format(product.sellPrice);
	const costPriceFormatted = priceFormatter.format(product.costPrice);
	const weightOrVolume = product.type === "FOOD" ? "Peso" : "Volumen";
	const createdAt = format(product.createdAt, "dd MMMM yy HH:mm", {
		locale: es
	});
	const updatedAt = format(product.updatedAt, "dd MMMM yy HH:mm", {
		locale: es
	});

	return (
		<>
			<div className="items-center space-y-2">
				<div className="flex items-center justify-between">
					<div>
						<Heading
							title={`#${product.id} ${product.name} - ${product?.brand?.name}`}
							mainPath={"/products"}
						/>
						<div className="text-sm text-gray-500 dark:text-gray-400">{product.description}</div>
					</div>
					<div className="grid">
						<Link href={`/panel/products/edit/${product.id}`}>
							<Button variant="ghost" className="group">
								<Edit className="h-6 w-6 hover:cursor-pointer group-hover:text-blue-500" />
							</Button>
						</Link>

						<DeleteButton type="products" session={session} itemId={product.id} />
					</div>
				</div>
			</div>
			<Separator />
			<div className="grid gap-2 md:gap-4 grid-cols-2 grid-flow-col">
				<div className="grid gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Precio de Venta</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-1xl">{sellPriceFormatted}</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Precio de Coste</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-1xl ">{costPriceFormatted}</div>
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-4">
					<Card>
						<CardHeader>
							<CardTitle>Tipo de producto</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center text-1xl ">
								{product.type === "DRINK" ? (
									<Beer className="w-6 h-6 mr-2" />
								) : (
									<Utensils className="w-6 h-6 mr-2" />
								)}
								{types.find(t => t.value === product.type)?.label}
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>{weightOrVolume}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-1xl ">{getType(product.type, 1500)}</div>
						</CardContent>
					</Card>
				</div>
			</div>
			<div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				<Card>
					<CardHeader>
						<CardTitle>Stock</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-1xl ">{product.stock}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Disponibilidad</CardTitle>
					</CardHeader>
					<CardContent>
						<div className={cn("text-1xl ", product.available ? "text-green-500" : "text-red-500")}>
							{product.available ? "Disponible" : "No disponible"}
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Fecha de Creación</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-1xl ">{createdAt}</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Fecha de Actualización</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-1xl ">{updatedAt}</div>
					</CardContent>
				</Card>
			</div>
			<div className="flex">
				<Card>
					<CardHeader>
						<CardTitle>Código de Barra</CardTitle>
					</CardHeader>
					<CardContent className="items-center text-center">
						<BarCode code={product.barcode} />
						<span className="text-sm text-gray-500 dark:text-gray-400 text-center">{product.barcode}</span>
					</CardContent>
				</Card>
			</div>
		</>
	);
}

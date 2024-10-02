"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import * as React from "react";

import type { OrderProduct, OrderProvider } from "@/forms/order/OrderForm";
import { cn } from "@/lib/utils";
import type { OrderFormType } from "@/schemas/OrderSchema";
import type { PopoverProps } from "@radix-ui/react-popover";
import { Button } from "@ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface ProductSelectorProps extends PopoverProps {
	providers: OrderProvider[];
	products: OrderProduct[];
	selectedProduct?: OrderProduct;
	setValue: UseFormSetValue<OrderFormType>;
}

export function ProductSelector({ providers, products, selectedProduct, setValue, ...props }: ProductSelectorProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen} {...props}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-label="Seleccionar un producto"
					aria-expanded={open}
					className="flex-1 justify-between "
				>
					{selectedProduct ? selectedProduct.name : "Seleccionar un producto..."}
					<CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Buscar productos..." />
					<CommandList>
						<CommandGroup heading="Productos">
							{products.map(preset => (
								<CommandItem
									key={preset.id}
									onSelect={() => {
										setValue("productId", preset.id);
										setOpen(false);
									}}
								>
									{preset.name}
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											selectedProduct?.id === preset.id ? "opacity-100" : "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
						<CommandEmpty>No se encontraron productos.</CommandEmpty>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

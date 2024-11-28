"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import * as React from "react";

import type { OrderProvider } from "@/forms/order/OrderForm";
import { cn } from "@/lib/utils";
import type { OrderFormType } from "@/schemas/OrderSchema";
import type { PopoverProps } from "@radix-ui/react-popover";
import { Button } from "@ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import type { UseFormSetValue, UseFormWatch } from "react-hook-form";

interface PresetSelectorProps extends PopoverProps {
	providers: OrderProvider[];
	selectedProvider?: OrderProvider;
	setValue: UseFormSetValue<OrderFormType>;
	updateDisplayedProducts: () => void;
}

export function ProviderSelector({
	providers,
	selectedProvider,
	setValue,
	updateDisplayedProducts,
	...props
}: PresetSelectorProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen} {...props}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-label="Seleccionar un proveedor"
					aria-expanded={open}
					className="flex-1 justify-between "
				>
					{selectedProvider ? selectedProvider.name : "Seleccionar un proveedor..."}
					<CaretSortIcon className="ml-2 h-6 w-6 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Buscar provedores..." />
					<CommandList>
						<CommandGroup heading="Provedores">
							{providers.map(preset => (
								<CommandItem
									key={preset.id}
									onSelect={() => {
										setValue("providerId", preset.id);
										updateDisplayedProducts();
										setOpen(false);
									}}
								>
									{preset.name}
									<CheckIcon
										className={cn(
											"ml-auto h-6 w-6",
											selectedProvider?.id === preset.id ? "opacity-100" : "opacity-0"
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

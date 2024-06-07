import { type InferType, array, boolean, number, object, string } from "yup";

export const DiscountFormSchema = object({
	name: string()
		.required("El nombre es requerido")
		.min(4, "El nombre debe tener al menos 4 caracteres")
		.max(50, "El nombre no puede tener más de 50 caracteres")
		.trim(),
	description: string().max(1024, "La descripción no puede tener más de 1024 caracteres").optional().trim(),
	type: string().required("El tipo de descuento es requerido").oneOf(["PERCENTAGE", "AMOUNT"]),
	value: number()
		.required("El valor del descuento es requerido")
		.min(0, "El valor del descuento no puede ser negativo"),
	active: boolean().required("El estado del descuento es requerido")
});

export type DiscountFormType = InferType<typeof DiscountFormSchema>;

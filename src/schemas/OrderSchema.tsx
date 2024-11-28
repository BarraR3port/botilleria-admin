import { type InferType, array, boolean, number, object, string } from "yup";

export const OrderFormSchema = object({
	total: number()
		.required("El valor de la orden es requerido")
		.min(500, "El valor de la orden no puede ser menor a 500"),
	totalWithVAT: number()
		.required("El valor de la orden es requerido")
		.min(500, "El valor de la orden no puede ser menor a 500"),
	status: string().required("El estado de la orden es requerido").trim(),
	createdAt: string().required("La fecha de creación es requerida").trim(),
	updatedAt: string().required("La fecha de actualización es requerida").trim(),
	userId: string().optional().trim(),
	providerId: number().required("El id del proveedor es requerido"),
	products: array().of(
		object({
			id: number().required("El id del producto es requerido"),
			quantity: number().required("La cantidad es requerida"),
			priceWithoutVAT: number().required("El precio sin IVA es requerido"),
			priceWithVAT: number().required("El precio con IVA es requerido"),
			costPrice: number().optional(),
			productId: number().required("El id del producto es requerido"),
			name: string().optional()
		})
	),
	listedProducts: array().of(
		object({
			id: number().required("El id del producto es requerido"),
			quantity: number().optional(),
			priceWithoutVAT: number().optional(),
			priceWithVAT: number().optional(),
			productId: number().optional()
		})
	),
	productId: number().optional()
});

export type OrderFormType = InferType<typeof OrderFormSchema>;

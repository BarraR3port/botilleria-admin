import { type InferType, array, boolean, number, object, string } from "yup";

export const ProductFormSchema = object({
	name: string()
		.required("El nombre es requerido")
		.min(4, "El nombre debe tener al menos 4 caracteres")
		.max(50, "El nombre no puede tener más de 50 caracteres")
		.trim(),
	description: string().max(1024, "La descripción no puede tener más de 1024 caracteres").optional().trim(),
	stock: number().required("El stock es requerido").min(0, "El stock no puede ser menor a 0"),
	barcode: string()
		.required("El código de barras es requerido")
		.min(12, "El código de barras debe tener 14 caracteres")
		.trim(),
	sellPrice: number().required("El precio de venta es requerido").min(0, "El precio de venta no puede ser menor a 0"),
	costPrice: number().required("El precio de coste es requerido").min(0, "El precio de coste no puede ser menor a 0"),
	weightOrVolume: number().required("Este valor es requerido").min(0, "Este valor no puede ser menor a 0"),
	brandId: string().required("La Marca es requerida").trim(),
	discountId: number().optional(),
	type: string().required("El tipo es requerida").trim(),
	available: boolean().required("La disponibilidad es requerida")
});

export type ProductFormType = InferType<typeof ProductFormSchema>;

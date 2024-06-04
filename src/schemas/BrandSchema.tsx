import { type InferType, array, boolean, number, object, string } from "yup";

export const BrandFormSchema = object({
	name: string()
		.required("El nombre es requerido")
		.min(4, "El nombre debe tener al menos 4 caracteres")
		.max(50, "El nombre no puede tener más de 50 caracteres")
		.trim(),
	description: string().max(1024, "La descripción no puede tener más de 1024 caracteres").optional().trim()
});

export type BrandFormType = InferType<typeof BrandFormSchema>;

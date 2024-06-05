import { type InferType, object, string } from "yup";

export const SignInFormSchema = object({
	email: string().required("Email requerido").email("Email inválido").trim(),
	password: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim()
});

export type SignInFromType = InferType<typeof SignInFormSchema>;

export const UpdateBasicUserInfoFormSchema = object({
	name: string()
		.required("auth.errors.firstName.required")
		.min(2, "auth.errors.firstName.minLength")
		.max(50, "auth.errors.firstName.maxLength")
		.trim(),
	lastName: string()
		.optional()
		.min(2, "auth.errors.lastName.minLength")
		.max(50, "auth.errors.lastName.maxLength")
		.trim(),
	birthDate: string().optional().nullable().trim(),
	gender: string().optional().nullable().trim(),
	phoneNumber: string().optional().nullable().trim(),
	description: string().optional().nullable().trim(),
	socialMedia: object({
		instagram: string().optional().nullable().trim()
	}).nonNullable()
});

export type UpdateBasicUserInfoFormType = InferType<typeof UpdateBasicUserInfoFormSchema>;

export const UpdateCriticalUserInfoFormSchema = object({
	company: string()
		.optional()
		.min(2, "auth.errors.company.minLength")
		.max(50, "auth.errors.company.maxLength")
		.trim(),
	password: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim(),
	confirmPassword: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim()
});

export type UpdateCriticalUserInfoFormType = InferType<typeof UpdateCriticalUserInfoFormSchema>;

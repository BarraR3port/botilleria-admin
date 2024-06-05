import { type InferType, object, string } from "yup";

export const CreateUserFormSchema = object({
	email: string().required("Email requerido").email("Email inválido").trim(),
	password: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim(),
	confirmPassword: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim(),
	name: string()
		.required("Nombre requerido")
		.min(2, "El nombre tiene que tener al menos 2 caracteres")
		.max(50, "El nombre tiene que tener menos de 50 caracteres")
		.trim(),
	lastName: string()
		.required("Apellido requerido")
		.min(2, "El apellido tiene que tener al menos 2 caracteres")
		.max(50, "El apellido tiene que tener menos de 50 caracteres")
		.trim(),
	rut: string()
		.required("Rut requerido")
		.matches(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/, "Rut inválido. Con guión y sin puntos ni espacios. Ej: 12345678-9")
		.trim(),
	rol: string().required("Rol requerido").oneOf(["ADMIN", "USER"], "Rol inválido").trim()
});

export type CreateUserFormType = InferType<typeof CreateUserFormSchema>;

export const UpdateBasicUserFormSchema = object({
	email: string().required("Email requerido").email("Email inválido").trim(),
	name: string()
		.required("Nombre requerido")
		.min(2, "El nombre tiene que tener al menos 2 caracteres")
		.max(50, "El nombre tiene que tener menos de 50 caracteres")
		.trim(),
	lastName: string()
		.required("Apellido requerido")
		.min(2, "El apellido tiene que tener al menos 2 caracteres")
		.max(50, "El apellido tiene que tener menos de 50 caracteres")
		.trim(),
	rut: string()
		.required("Rut requerido")
		.matches(/^[0-9]+[-|‐]{1}[0-9kK]{1}$/, "Rut inválido. Con guión y sin puntos ni espacios. Ej: 12345678-9")
		.trim(),
	rol: string().required("Rol requerido").oneOf(["ADMIN", "USER"], "Rol inválido").trim()
});

export type UpdateBasicUserFormType = InferType<typeof UpdateBasicUserFormSchema>;

export const UpdateCriticUserFormSchema = object({
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

export type UpdateCriticUserFormType = InferType<typeof UpdateCriticUserFormSchema>;

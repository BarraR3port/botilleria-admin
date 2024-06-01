import { type InferType, object, string, date, array, boolean } from "yup";

export const SignInFormSchema = object({
	email: string().required("Email requerido").email("Email inválido").trim(),
	password: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim()
});

export type SignInFromType = InferType<typeof SignInFormSchema>;

export const SignUpFormSchema = object({
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
	firstName: string()
		.required("Nombre requerido")
		.min(2, "El nombre tiene que tener al menos 2 caracteres")
		.max(50, "El nombre tiene que tener menos de 50 caracteres")
		.trim(),
	lastName: string()
		.required("Apellido requerido")
		.min(2, "El apellido tiene que tener al menos 2 caracteres")
		.max(50, "El apellido tiene que tener menos de 50 caracteres")
		.trim()
});

export type SignUpFromType = InferType<typeof SignUpFormSchema>;

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

export const VerifyUserEmailSchema = object({
	token: string()
		.min(1, "auth.errors.email.verification.minCharacters")
		.max(6, "auth.errors.email.verification.maxCharacters")
		.trim()
});

export type VerifyUserEmailType = InferType<typeof VerifyUserEmailSchema>;

export const DeleteGoogleAccountSchema = object({
	username: string()
		.required("auth.errors.username.required")
		.min(4, "auth.errors.username.minLength")
		.max(50, "auth.errors.username.maxLength")
		.trim()
});

export type DeleteGoogleAccountType = InferType<typeof DeleteGoogleAccountSchema>;

export const DeleteEmailAccountSchema = object({
	password: string()
		.required("Contraseña requerida")
		.min(6, "La contraseña tiene que tener al menos 6 caracteres")
		.max(50, "La contraseña tiene que tener menos de 50 caracteres")
		.trim()
});

export type DeleteEmailAccountType = InferType<typeof DeleteEmailAccountSchema>;

export const SignInBasicFormSchema = object({
	username: string()
		.required("Ingresa un nombre de usuario")
		.min(4, "Mínimo 4 caracteres")
		.max(16, "Máximo 16 caracteres")
		.trim(),
	gender: string()
		.oneOf(["Femenino", "Masculino", "NoBinario", "Otro"], "Debe seleccionar un género")
		.required("Debe seleccionar un género"),
	name: string().required("Ingresa un nombre").min(3, "Mínimo 3 caracteres").max(16, "Máximo 16 caracteres").trim(),
	lastName: string().notRequired(),
	phoneNumber: string()
		.matches(/^(?:(?:\+569)|569|9)?\d{8}$/, "Número de teléfono inválido")
		.required("Debe ingresar su número telefónico"),
	birthDate: date().required("Debe ingresar su fecha de nacimiento"),
	instagram: string().notRequired(),
	description: string().notRequired()
});

export type SignInBasicFormDataType = InferType<typeof SignInBasicFormSchema>;

export const SignInDenseFormSchema = object({
	musicInterest: array(string().required()).required(),
	deportsInterest: array(string().required()).required(),
	artAndCultureInterest: array(string().required()).required(),
	techInterest: array(string().required()).required(),
	hobbiesInterest: array(string().required()).required()
});

export type SignInDenseFormDataType = InferType<typeof SignInDenseFormSchema>;

export const ProfilePictureSchema = object({
	id: string().notRequired(),
	url: string().notRequired()
}).defined();

export const SignInImagesFormSchema = object({
	images: array(ProfilePictureSchema)
		.min(1, "Al menos una imagen")
		.max(3, "Maximo 3 imágenes")
		.required("Imagen requerida"),
	location: boolean().required("Permiso requerido")
});

export type SignInImagesFormDataType = InferType<typeof SignInImagesFormSchema>;

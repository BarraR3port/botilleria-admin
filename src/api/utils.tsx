import { toast } from "@/components/ui/use-toast";
import type { ApiResponse, AuthResponse, UserErrorResponse } from "@/objects";

export async function handleAxiosResponse(response: any, form?: any): Promise<ApiResponse> {
	if (!response) {
		return undefined;
	}
	if (
		response.data.status === 200 ||
		response.data.status === 201 ||
		response.data.status === 204 ||
		response.data.status === 304
	) {
		return response.data;
	}

	const error: UserErrorResponse = response.data;
	if (typeof error === "object" && "errors" in error) {
		error.errors.forEach(errorMessage => {
			form?.setError(errorMessage.type as any, { message: errorMessage.message });
			toast({
				title: errorMessage.message,
				variant: "destructive",
				duration: 1500
			});
		});
		throw new Error(
			error.errors[0].message || "Ocurrió un error inesperado, por favor contactar soporte",
			response.data
		);
	}

	toast({
		title: "Ocurrió un error inesperado, por favor contactar soporte",
		variant: "destructive",
		duration: 1500
	});

	return response.data;
}

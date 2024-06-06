import type { ApiResponse } from "@/objects";

export async function handleAxiosResponse(response: any): Promise<ApiResponse> {
	if (!response) {
		return undefined;
	}
	if (response.status === 200 || response.status === 201 || response.status === 204 || response.status === 304) {
		return response.data;
	}
	throw new Error("Error with request Status:", response.status);
}

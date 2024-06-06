"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BasicModal from "@/modals/basic-modal";
import { RecoverFormSchema, type RecoverFromType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useState } from "react";
import type { ApiResponse, UserAuthError } from "@/objects";
import { toast } from "../ui/use-toast";
import { handleAxiosResponse } from "@/api/utils";

export function RecoverForm() {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const form = useForm<RecoverFromType>({
		resolver: yupResolver(RecoverFormSchema),
		defaultValues: {
			email: ""
		},
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<RecoverFromType> = async data => {
		setLoading(true);
		const response = await axios
			.post("/api/auth/recover", data)
			.catch((error: ApiResponse) => {
				if (!error) return null;

				if (typeof error === "object" && "response" in error && "data" in error.response) {
					if ("errors" in error.response.data) {
						error.response.data.errors.forEach(errorMessage => {
							form.setError(errorMessage.type as any, { message: errorMessage.message });
							toast({
								title: errorMessage.message,
								variant: "destructive",
								duration: 1500
							});
						});
					}
					return null;
				}
			})
			.then(handleAxiosResponse);

		if (response) setOpen(true);

		setLoading(false);
	};

	return (
		<div>
			<BasicModal
				title="Correo de recuperación enviado"
				description="Se ha enviado un correo de recuperación, revisa tu bandeja de entrada y spam para recuperar tu cuenta."
				open={open}
				onConfirm={() => {
					console.log("close");
					setOpen(false);
				}}
				loading={loading}
			/>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										disabled={loading}
										id="email"
										placeholder="email@ejemplo.com"
										required
										autoComplete="email"
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className="w-full" type="submit" loading={loading}>
						Solicitar recuperación
					</Button>
				</form>
			</Form>
		</div>
	);
}

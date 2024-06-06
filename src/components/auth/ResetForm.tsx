"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

import { handleAxiosResponse } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import BasicModal from "@/modals/basic-modal";
import type { ApiResponse } from "@/objects";
import { ResetFormSchema, type ResetFromType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Recovery } from "@prisma/client";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "../ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ResetFormProps {
	email: string;
	recovery: Recovery;
}

export function ResetForm({ email, recovery }: ResetFormProps) {
	const [loading, setLoading] = useState(false);
	const [passwordHidden, setPasswordHidden] = useState(false);
	const router = useRouter();

	const form = useForm<ResetFromType>({
		resolver: yupResolver(ResetFormSchema),
		defaultValues: {
			email,
			password: "",
			confirmPassword: ""
		},
		reValidateMode: "onChange"
	});

	const onSubmit: SubmitHandler<ResetFromType> = async data => {
		setLoading(true);
		const response = await axios
			.post("/api/auth/reset", {
				...data,
				recoveryId: recovery.id,
				email,
				token: recovery.token
			})
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

		if (response) {
			const signInResponse = await signIn("credentials", {
				redirect: false,
				callbackUrl: "/panel",
				email,
				password: data.password
			}).catch(error => {
				console.log("|| Error", error);
				return error;
			});

			if (signInResponse) {
				if (signInResponse.ok && signInResponse.url) {
					window.location.href = signInResponse.url;
				}
			}
		}

		setLoading(false);
	};

	return (
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
									disabled
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
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contraseña</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										disabled={loading}
										required
										type={passwordHidden ? "current-password" : "password"}
										autoComplete="off"
										autoSave={"password"}
										{...field}
									/>
									{passwordHidden ? (
										<EyeOff
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									) : (
										<Eye
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirmar contraseña</FormLabel>
							<FormControl>
								<div className="relative">
									<Input
										disabled={loading}
										required
										type={passwordHidden ? "new-password" : "password"}
										autoComplete="new-password"
										autoSave={"new-password"}
										{...field}
									/>
									{passwordHidden ? (
										<EyeOff
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									) : (
										<Eye
											onClick={() => setPasswordHidden(!passwordHidden)}
											size={18}
											className="absolute transform -translate-y-1/2 right-3 top-1/2"
										/>
									)}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="w-full" type="submit" loading={loading}>
					Actualizar contraseña
				</Button>
			</form>
		</Form>
	);
}

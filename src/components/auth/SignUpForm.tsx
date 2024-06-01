"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

import { Form, FormLabel } from "@/components/ui/form";
import { SignUpFormSchema, type SignUpFromType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UserAuthError } from "@/objects";
import { useAppStore } from "@/store/AppStore";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

export function SignUpForm() {
	const { assignUserDetails } = useAppStore();
	const [passwordHidden, setPasswordHidden] = useState(false);
	const [loading, setLoading] = useState(false);

	const router = useRouter();

	const signUpForm = useForm<SignUpFromType>({
		resolver: yupResolver(SignUpFormSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			firstName: "",
			lastName: ""
		},
		reValidateMode: "onChange"
	});

	const onSubmitSignUpForm: SubmitHandler<SignUpFromType> = async data => {
		if (data.password !== data.confirmPassword) {
			signUpForm.setError("confirmPassword", {
				type: "manual",
				message: "Las contraseñas no coinciden"
			});
			return;
		}
		setLoading(true);
		const response = await axios
			.post("/api/auth/signUp", data)
			.catch(error => {
				return error.response.data;
			})
			.then(response => response.data);

		if (typeof response === "object" && "errors" in response) {
			response.errors.forEach((error: UserAuthError) => {
				toast({
					title: error.message,
					variant: "destructive"
				});
			});
			setLoading(false);
			return false;
		}

		assignUserDetails(response);
		router.push("/");
		setLoading(false);
	};

	return (
		<div>
			<Form {...signUpForm}>
				<form
					onSubmit={event => {
						signUpForm.handleSubmit(onSubmitSignUpForm)(event);
					}}
					className="space-y-4 "
				>
					<div className="flex gap-4">
						<FormField
							control={signUpForm.control}
							name="firstName"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											required
											type="text"
											autoComplete="username"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={signUpForm.control}
							name="lastName"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Apellido</FormLabel>
									<FormControl>
										<Input disabled={loading} required type="text" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={signUpForm.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										disabled={loading}
										placeholder="email@example.com"
										autoComplete="email"
										required
										type="email"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={signUpForm.control}
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
						control={signUpForm.control}
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
					<Button className="w-full" type="submit" loading={loading} disabled={loading}>
						Registrarse
					</Button>
				</form>
			</Form>
		</div>
	);
}

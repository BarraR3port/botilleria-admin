"use client";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { triggerFireworks } from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import type { AuthResponse } from "@/objects";
import { CreateUserFormSchema, type CreateUserFormType } from "@/schemas/UserSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { Eye, EyeOff, Plus } from "lucide-react";
import type { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormProps {
	roles: {
		value: string;
		label: string;
	}[];
	session: Session;
}

export default function NewUserForm({ roles, session }: FormProps) {
	const [passwordHidden, setPasswordHidden] = useState(false);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<CreateUserFormType>({
		resolver: yupResolver(CreateUserFormSchema),
		defaultValues: {
			name: "",
			lastName: "",
			email: "",
			rol: "USER",
			password: "",
			confirmPassword: "",
			rut: ""
		}
	});

	const onSubmit = async (data: CreateUserFormType) => {
		setLoading(true);
		try {
			const response = await axios
				.post("/api/users", data, {
					headers: {
						Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
					}
				})
				.catch(res => catchAxiosResponse(res, form))
				.then(res => handleAxiosResponse(res, form));

			if (response) {
				toast({
					title: "Usuario creado correctamente",
					variant: "success",
					duration: 1500
				});

				triggerFireworks();
				router.replace("/panel/users");
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error interno, por favor contactar soporte",
				variant: "error",
				duration: 1500
			});
		} finally {
			setLoading(false);
		}
	};
	return (
		<>
			<div className="sm:flex items-center justify-between space-y-4">
				<Heading title={"Crear Usuario"} />
			</div>
			<Separator />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full flex-col">
					<div className="space-y-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loading}
												placeholder="Nombre del usuario"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loading}
												placeholder="Apellido del usuario"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loading}
												placeholder="Email del usuario"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="rut"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rut</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loading}
												placeholder="Rut del usuario"
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
							<FormField
								control={form.control}
								name="rol"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rol</FormLabel>
										<FormControl>
											<Select
												disabled={loading}
												onValueChange={field.onChange}
												value={field.value}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue
															defaultValue={field.value}
															placeholder="Selecciona el rol"
														/>
														<SelectContent>
															{roles.map(rol => {
																return (
																	<SelectItem key={rol.value} value={rol.value}>
																		{rol.label}
																	</SelectItem>
																);
															})}
														</SelectContent>
													</SelectTrigger>
												</FormControl>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<div className="flex gap-2 justify-end">
						<Button className="h-8 gap-1" type="submit" variant="success" loading={loading}>
							<Plus className="h-4 w-4" />
							Crear
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}

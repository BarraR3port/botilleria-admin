"use client";

import { catchAxiosResponse, handleAxiosResponse } from "@/api/utils";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import AlertModal from "@/modals/alert-modal";
import type { AuthResponse } from "@/objects";
import {
	UpdateBasicUserFormSchema,
	type UpdateBasicUserFormType,
	UpdateCriticUserFormSchema,
	type UpdateCriticUserFormType
} from "@/schemas/UserSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import type { User } from "@prisma/client";
import axios from "axios";
import { Eye, EyeOff, Save, Trash } from "lucide-react";
import type { Session } from "next-auth";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface FormProps {
	user: Partial<User>;
	roles: {
		value: string;
		label: string;
	}[];
	session: Session;
}

export default function UserForm({ user, roles, session }: FormProps) {
	const [open, setOpen] = useState(false);
	const [passwordHidden, setPasswordHidden] = useState(false);
	const [loadingBasic, setLoadingBasic] = useState(false);
	const [loadingCritic, setLoadingCritic] = useState(false);
	const { toast } = useToast();
	const params = useParams();
	const router = useRouter();

	const basicForm = useForm<UpdateBasicUserFormType>({
		resolver: yupResolver(UpdateBasicUserFormSchema),
		defaultValues: {
			...user
		}
	});

	const criticForm = useForm<UpdateCriticUserFormType>({
		resolver: yupResolver(UpdateCriticUserFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: ""
		}
	});

	const onSubmitBasic = async (data: UpdateBasicUserFormType) => {
		setLoadingBasic(true);
		try {
			const response = await axios
				.patch(`/api/users/${params.userId}`, data, {
					headers: {
						Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
					}
				})
				.catch(res => catchAxiosResponse(res, basicForm))
				.then(res => handleAxiosResponse(res, basicForm));

			if (response) {
				toast({
					title: "Usuario editado correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/users");
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al guardar los ajustes",
				variant: "error",
				duration: 1500
			});
		} finally {
			setLoadingBasic(false);
		}
	};

	const onSubmitCritic = async (data: UpdateCriticUserFormType) => {
		setLoadingCritic(true);
		try {
			const response = await axios
				.patch(
					`/api/users/${params.userId}`,
					{
						...data,
						type: "password"
					},
					{
						headers: {
							Authorization: `Bearer ${session?.user.backendTokens.accessToken.token}`
						}
					}
				)
				.catch(res => catchAxiosResponse(res, criticForm))
				.then(res => handleAxiosResponse(res, criticForm));

			if (response) {
				toast({
					title: "Contraseña actualizada correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/users");
				router.refresh();
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al guardar los ajustes",
				variant: "error",
				duration: 1500
			});
		} finally {
			setLoadingCritic(false);
		}
	};

	async function onDelete() {
		setLoadingBasic(true);
		setLoadingCritic(true);
		try {
			const response = await axios.delete(`/api/users/${params.userId}`);
			if (response?.data) {
				toast({
					title: "Usuario eliminado correctamente",
					variant: "success",
					duration: 1500
				});
				router.replace("/panel/users");
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Ocurrió un error al eliminar el usuario",
				variant: "error",
				duration: 1500
			});
		} finally {
			setLoadingBasic(false);
			setLoadingCritic(false);
		}
	}

	return (
		<>
			<AlertModal open={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loadingBasic} />
			<div className="sm:flex items-center justify-between space-y-4">
				<Heading title={"Editar Usuario"} />
				<Button
					className="h-8 gap-1 "
					variant="destructive"
					onClick={() => {
						setOpen(true);
					}}
				>
					<Trash className="h-4 w-4" />
					<span>Eliminar</span>
				</Button>
			</div>
			<Separator />
			<Form {...basicForm}>
				<form onSubmit={basicForm.handleSubmit(onSubmitBasic)} className="space-y-2 w-full flex-col">
					<div className="space-y-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
							<FormField
								control={basicForm.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loadingBasic}
												placeholder="Nombre del usuario"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={basicForm.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nombre</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loadingBasic}
												placeholder="Apellido del usuario"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={basicForm.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loadingBasic}
												placeholder="Email del usuario"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={basicForm.control}
								name="rut"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rut</FormLabel>
										<FormControl>
											<Input
												autoComplete="off"
												disabled={loadingBasic}
												placeholder="Rut del usuario"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={basicForm.control}
								name="rol"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Rol</FormLabel>
										<FormControl>
											<Select
												disabled={loadingBasic}
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
						<Button className="h-8 gap-1" type="submit" variant="success" loading={loadingBasic}>
							<Save className="h-4 w-4" />
							Actualizar usuario
						</Button>
					</div>
				</form>
			</Form>
			<Separator />
			<Form {...criticForm}>
				<form onSubmit={criticForm.handleSubmit(onSubmitCritic)} className="space-y-2 w-full flex-col">
					<div className="space-y-2">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ">
							<FormField
								control={criticForm.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Contraseña</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													disabled={loadingCritic}
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
								control={criticForm.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmar contraseña</FormLabel>
										<FormControl>
											<div className="relative">
												<Input
													disabled={loadingCritic}
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
						</div>
					</div>
					<div className="flex gap-2 justify-end">
						<Button className="h-8 gap-1" type="submit" variant="success" loading={loadingCritic}>
							<Save className="h-4 w-4" />
							Actualizar contraseña
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}

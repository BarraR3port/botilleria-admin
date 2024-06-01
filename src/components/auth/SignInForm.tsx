"use client";

import { type SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignInFormSchema, type SignInFromType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "../ui/separator";
import Link from "next/link";

export function SignInForm() {
	const [loading, setLoading] = useState(false);

	const signInForm = useForm<SignInFromType>({
		resolver: yupResolver(SignInFormSchema),
		defaultValues: {
			email: "",
			password: ""
		},
		reValidateMode: "onChange"
	});

	const router = useRouter();

	const [passwordHidden, setPasswordHidden] = useState(false);

	const onSubmit: SubmitHandler<SignInFromType> = async data => {
		setLoading(true);
		/* await signIn(data); */
		setLoading(false);
	};

	return (
		<div>
			<>
				<Form {...signInForm}>
					<form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={signInForm.control}
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
											type="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={signInForm.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contraseña</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												disabled={loading}
												required
												type={passwordHidden ? "text" : "password"}
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
							Ingresar
						</Button>
					</form>
				</Form>
				<Separator className="my-8">o</Separator>
				<Link className="flex items-center justify-center w-full py-2 text-sm underline" href="/forgotPassword">
					¿Se te olvidó tu contraseña?
				</Link>
			</>
		</div>
	);
}

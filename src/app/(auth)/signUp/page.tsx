import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUp() {
	return (
		<div className="flex  justify-center min-h-[calc(100dvh-7rem)]">
			<div className="w-full max-w-[350px] px-4 space-y-6 ">
				<div className="w-32 h-32 mx-auto ">
					{/* <Image src="/pary-white-512.webp" alt="Pary Studio" width={128} height={128} /> */}
				</div>
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Registrarse</h1>
				</div>
				<SignUpForm />
			</div>
		</div>
	);
}

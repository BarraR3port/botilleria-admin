"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Component() {
	const router = useRouter();

	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-6 lg:px-8">
			<div className="max-w-md text-center space-y-4">
				<h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50">404</h1>
				<p className="text-lg text-gray-500 dark:text-gray-400">
					Ups, el usuario que estás buscando no se pudo encontrar.
				</p>
				<Button variant="link" onClick={() => router.back()}>
					Volver
				</Button>
			</div>
		</div>
	);
}

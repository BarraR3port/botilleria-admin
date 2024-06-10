import Link from "next/link";

export default function Component() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-6 lg:px-8">
			<div className="max-w-md text-center space-y-4">
				<h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-gray-50">404</h1>
				<p className="text-lg text-gray-500 dark:text-gray-400">
					Ups, el descuento que estás buscando no se pudo encontrar.
				</p>
				<Link href="/panel/products/discounts" className="text-blue-600 hover:underline">
					Volver
				</Link>
			</div>
		</div>
	);
}

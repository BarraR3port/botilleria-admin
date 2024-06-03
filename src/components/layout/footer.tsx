"use client";
import { usePathname } from "next/navigation";

export default function Footer() {
	const pathName = usePathname();
	if (pathName.includes("panel")) {
		return null;
	}
	return (
		<footer className="bg-gray-900 p-2 text-white">
			<div className="flex items-center justify-center">
				<p>&copy; 2024 Botillería La Tía. Todos los derechos reservados.</p>
			</div>
		</footer>
	);
}

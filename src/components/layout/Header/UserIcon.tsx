"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Home, LogOut, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export function UserIcon() {
	const { data } = useSession();
	const router = useRouter();
	const pathName = usePathname();

	const signOutHandler = () => {
		signOut();
		router.refresh();
	};

	if (!data?.user) {
		return (
			<div className="flex space-x-2 ">
				{pathName !== "/signIn" && (
					<Link href={"/signIn"} className={buttonVariants({ size: "sm" })}>
						<span>Iniciar Sesión</span>
					</Link>
				)}
			</div>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="flex self-center flex-auto gap-2 font-medium ">
					<Button variant="ghost" className="relative rounded-full w-9 h-9">
						<Avatar className="w-9 h-9">
							<AvatarFallback>
								{data?.user.name?.[0]?.toUpperCase()}
								{data?.user.lastName?.[0]?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
					<div className="hidden md:flex flex-col space-y-1">
						<p className="flex text-sm font-medium leading-none">
							{data?.user?.name} {data?.user?.lastName}
						</p>
						<p className="text-xs leading-none text-muted-foreground md:flex">{data?.user?.email}</p>
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-50" align="end" forceMount>
				<div className="hidden md:flex">
					<DropdownMenuLabel className="font-normal ">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none xs:flex">
								{data?.user?.name} {data?.user?.lastName}
							</p>
							<p className="text-xs leading-none text-muted-foreground md:flex">{data?.user?.email}</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
				</div>

				 <DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => {
							router.push("/panel");
						}}
					>
						Panel
						<DropdownMenuShortcut>
							<Home size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							router.push("/panel/settings");
						}}
					>
						Ajustes
						<DropdownMenuShortcut>
							<Settings size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signOutHandler()}>
					Salir
					<DropdownMenuShortcut>
						<LogOut size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

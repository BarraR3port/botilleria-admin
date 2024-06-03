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
import { useAppStore } from "@/store/AppStore";
import { History, Home, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type UserIconProps = {
	navBar?: boolean;
};

export function UserIcon({ navBar }: UserIconProps) {
	const { signOut, user } = useAppStore();
	const router = useRouter();
	const pathName = usePathname();

	const signOutHandler = () => {
		signOut();
	};

	if (!user) {
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
								{user.name?.[0]?.toUpperCase()}
								{user.lastName?.[0]?.toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</Button>
					{navBar && (
						<div className="flex flex-col space-y-1">
							<p className="flex text-sm font-medium leading-none">
								{user?.name} {user?.lastName}
							</p>
						</div>
					)}
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-50" align="end" forceMount>
				{!navBar && (
					<>
						<DropdownMenuLabel className="font-normal ">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none xs:flex">
									{user?.name} {user?.lastName}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
					</>
				)}
				<DropdownMenuGroup>
					<DropdownMenuItem
						onClick={() => {
							router.push("/dashboard/package/");
						}}
					>
						Panel
						<DropdownMenuShortcut>
							<History size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							router.push("/dashboard/settings/");
						}}
					>
						Ajustes
						<DropdownMenuShortcut>
							<Settings size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							router.push("/");
						}}
					>
						Panel
						<DropdownMenuShortcut>
							<Home size={16} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signOutHandler()}>
					Cerrar Sesión
					<DropdownMenuShortcut>
						<LogOut size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MinusIcon, PlusIcon, SearchIcon } from "lucide-react";

export default function Component() {
	return (
		<main className="flex-1 bg-gray-100 dark:bg-gray-950 p-6">
			<div className="grid grid-cols-3 gap-6">
				<div className="col-span-2 rounded-lg bg-white p-6 shadow dark:bg-gray-900">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-2xl font-bold">Menu</h2>
						<div className="flex items-center gap-2">
							<Input
								type="search"
								placeholder="Search menu..."
								className="h-8 rounded-md border-gray-300 bg-gray-100 px-3 text-sm focus:border-gray-500 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-gray-500"
							/>
							<Button variant="ghost" size="icon" className="rounded-full">
								<SearchIcon className="h-5 w-5" />
							</Button>
						</div>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<Card className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
							<img
								src="/placeholder.svg"
								alt="Beer"
								width={150}
								height={150}
								className="mx-auto mb-2 h-[150px] w-[150px] rounded-lg object-cover"
							/>
							<div className="text-center">
								<h3 className="text-lg font-bold">IPA</h3>
								<p className="text-gray-500 dark:text-gray-400">$7.00</p>
							</div>
						</Card>
						<Card className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
							<img
								src="/placeholder.svg"
								alt="Burger"
								width={150}
								height={150}
								className="mx-auto mb-2 h-[150px] w-[150px] rounded-lg object-cover"
							/>
							<div className="text-center">
								<h3 className="text-lg font-bold">Burger</h3>
								<p className="text-gray-500 dark:text-gray-400">$12.00</p>
							</div>
						</Card>
						<Card className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md dark:border-gray-700 dark:bg-gray-900">
							<img
								src="/placeholder.svg"
								alt="Fries"
								width={150}
								height={150}
								className="mx-auto mb-2 h-[150px] w-[150px] rounded-lg object-cover"
							/>
							<div className="text-center">
								<h3 className="text-lg font-bold">Fries</h3>
								<p className="text-gray-500 dark:text-gray-400">$5.00</p>
							</div>
						</Card>
					</div>
				</div>
				<div className="rounded-lg bg-white p-6 shadow dark:bg-gray-900">
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-2xl font-bold">Order</h2>
						<Button variant="primary" className="h-8 rounded-md px-4 text-sm">
							Place Order
						</Button>
					</div>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img
									src="/placeholder.svg"
									alt="Beer"
									width={50}
									height={50}
									className="rounded-lg object-cover"
								/>
								<div>
									<h3 className="text-lg font-bold">IPA</h3>
									<p className="text-gray-500 dark:text-gray-400">$7.00</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon" className="rounded-full">
									<MinusIcon className="h-5 w-5" />
								</Button>
								<span>1</span>
								<Button variant="ghost" size="icon" className="rounded-full">
									<PlusIcon className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img
									src="/placeholder.svg"
									alt="Burger"
									width={50}
									height={50}
									className="rounded-lg object-cover"
								/>
								<div>
									<h3 className="text-lg font-bold">Burger</h3>
									<p className="text-gray-500 dark:text-gray-400">$12.00</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon" className="rounded-full">
									<MinusIcon className="h-5 w-5" />
								</Button>
								<span>1</span>
								<Button variant="ghost" size="icon" className="rounded-full">
									<PlusIcon className="h-5 w-5" />
								</Button>
							</div>
						</div>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<img
									src="/placeholder.svg"
									alt="Fries"
									width={50}
									height={50}
									className="rounded-lg object-cover"
								/>
								<div>
									<h3 className="text-lg font-bold">Fries</h3>
									<p className="text-gray-500 dark:text-gray-400">$5.00</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon" className="rounded-full">
									<MinusIcon className="h-5 w-5" />
								</Button>
								<span>1</span>
								<Button variant="ghost" size="icon" className="rounded-full">
									<PlusIcon className="h-5 w-5" />
								</Button>
							</div>
						</div>
					</div>
					<div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<p className="text-lg font-bold">Total</p>
							<p className="text-2xl font-bold">$24.00</p>
						</div>
						<div className="mt-4 flex justify-end gap-2">
							<Button variant="outline" className="h-8 rounded-md px-4 text-sm">
								Cancel
							</Button>
							<Button variant="primary" className="h-8 rounded-md px-4 text-sm">
								Pay
							</Button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

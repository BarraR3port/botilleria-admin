import { RedirectType, redirect } from "next/navigation";

export default function Index() {
	redirect("/panel", RedirectType.replace);
}

import { redirect, RedirectType } from "next/navigation";

export default function Index() {
	redirect("/panel", RedirectType.replace);
}

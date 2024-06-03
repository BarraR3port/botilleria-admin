import { auth } from "@/auth";

export default async function Index() {
	const session = await auth();
	if (!session) {
		return null;
	}

	return (
		<div className="flex flex-col gap-4">
			{/* <BasicUserSettingsForm />
			<DangerZoneUserData /> */}
		</div>
	);
}

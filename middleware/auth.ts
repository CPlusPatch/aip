import { User } from "~/db/entities/User";

export default defineNuxtRouteMiddleware(async middleware => {
	const user = (await useFetch<User>("/api/user")).data.value;

	if (!user) {
		return navigateTo(
			"/auth/login?" +
				new URLSearchParams({
					next: middleware.fullPath,
				})
		);
	}

	if (!user.isEmailVerified) {
		return navigateTo("/auth/register");
	}
});

export default defineNuxtRouteMiddleware(async middleware => {
	const user = (await useFetch("/api/user/get")).data.value;

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

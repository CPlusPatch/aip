export default defineNuxtRouteMiddleware(async middleware => {
	if (process.client) return;

	if (process.server) {
		const user = (await useFetch("/api/user/get")).data.value;

		if (!user) {
			return navigateTo(
				"/auth/login?" +
					new URLSearchParams({
						next: middleware.fullPath,
					})
			);
		}
	}
});

<script setup lang="ts">
import { User } from "~/db/entities/User";
const open = ref(false);

const user = (await useFetch(`/api/user/get`)).data.value as User;

if (!user)
	navigateTo(
		"/auth/login?" +
			new URLSearchParams({
				next: "/",
			})
	);
</script>

<template>
	<ChatsChatSidebarWrapper :open="open" :user="user" @close="open = false" />

	<div
		class="bg-dark-400 flex h-full max-w-full flex-1 flex-col dark font-['Inter'] px-4 md:px-10 py-50">
		<div class="h-full w-full flex flex-col gap-8">
			<div
				class="rounded bg-orange-500 text-white flex items-center justify-center w-15 h-15 mx-auto">
				<Icon name="tabler:brain" class="w-10 h-10" />
			</div>
			<div class="mx-auto max-w-3xl text-center">
				<h1 class="text-3xl font-bold text-white">Congratulations!</h1>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { User } from "~/db/entities/User";
const id = Number(useRoute().params.id);

useHead({
	title: "Chat · AIP",
});

const open = ref(false);

definePageMeta({
	middleware: "auth",
});

const user = (await useFetch(`/api/user/get`)).data.value as User;

if (!user)
	navigateTo(
		"/auth/login?" +
			new URLSearchParams({
				next: "/",
			})
	);

useHead({
	title: `Chat · AIP`,
});
</script>

<template>
	<ChatsChatSidebarWrapper :open="open" :user="user" @close="open = false" />

	<ChatsMainChat :id="id" :user="user" @sidebar-toggle="open = true" />
</template>

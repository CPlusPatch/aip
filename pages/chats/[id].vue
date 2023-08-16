<script setup lang="ts">
import { User } from "~/db/entities/User";
const id = Number(useRoute().params.id);

useHead({
	title: "Chat · AIP",
});

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
</script>

<template>
	<ChatsChatSidebar :user="user" />

	<ChatsMainChat :id="id" :user="user" />
</template>

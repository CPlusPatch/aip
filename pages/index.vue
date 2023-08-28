<script setup lang="ts">
import { User } from "~/db/entities/User";
import { Chat } from "~/db/entities/Chat";
const token = useCookie("token");

const user = (await useFetch(`/api/user/get`)).data.value as User;

if (!user)
	navigateTo(
		"/auth/login?" +
			new URLSearchParams({
				next: "/",
			})
	);

const chat = await useFetch<Chat>("/api/chats", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token.value}`,
	},
	body: JSON.stringify({
		model: "L2-13BU-L1",
	}),
});

if (!chat.data.value) {
	throw createError({
		statusCode: 500,
		message: "There was an error creating a new chat :(",
	});
}

navigateTo(`/chats/${chat.data.value.id}`);

useHead({
	title: "New Chat · AIP",
});

definePageMeta({
	middleware: "auth",
});
</script>

<template>
	<ChatsChatSidebar :user="user" />

	<ChatsMainChat :id="chat.data.value?.id ?? ''" :user="user" />
</template>

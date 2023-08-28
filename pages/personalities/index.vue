<script setup lang="ts">
import { Client } from "~/packages/api";
const token = useCookie("token");

const client = new Client(token.value ?? "");

const personalities = ref(await client.getPersonalities());

if (!personalities) {
	throw createError({
		statusCode: 404,
		message: "Personalities not found",
	});
}

definePageMeta({
	middleware: "auth",
	layout: "account",
});

const newPersonality = async () => {
	const personality = await client.createPersonality({
		name: "Joe Biden",
		description: "Joe Biden is the 46th president of the United States.",
		prompt: "Hey, I'm Joe Biden, the 46th president of the United States.",
	});

	navigateTo(`/personalities/${personality.id}`);
};
</script>

<template>
	<div
		class="bg-dark-400 !h-[100dvh] h-screen overflow-y-scroll no-scrollbar w-full h-full">
		<div class="bg-dark-800">
			<header
				class="lg:flex lg:items-center lg:justify-between py-20 px-6 max-w-7xl mx-auto">
				<div class="min-w-0 flex-1">
					<h2
						class="text-2xl font-bold leading-7 text-gray-50 sm:truncate sm:text-3xl sm:tracking-tight">
						Personalities
					</h2>
					<div
						class="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
						<div
							class="mt-2 flex items-center text-sm text-gray-400">
							<Icon
								name="tabler:users-group"
								class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
								aria-hidden="true" />
							{{ personalities.length }}
							{{
								personalities.length === 1
									? "personality"
									: "personalities"
							}}
						</div>
					</div>
				</div>
				<div class="mt-5 flex lg:ml-4 lg:mt-0">
					<span class="hidden sm:block">
						<Button
							theme="orange"
							type="button"
							@click="newPersonality">
							New
							<Icon
								name="tabler:plus"
								class="-mr-0.5 ml-1.5 h-5 w-5"
								aria-hidden="true" />
						</Button>
					</span>
				</div>
			</header>
		</div>

		<div class="w-full h-0.5 bg-dark-100"></div>

		<div class="mx-auto max-w-7xl mt-20 px-6">
			<ul
				role="list"
				class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
				<li
					v-for="person in personalities"
					:key="person.id"
					class="col-span-1 flex flex-row rounded bg-dark-600 ring-1 ring-dark-200 shadow p-3 hover:ring-orange-500 duration-200 hover:ring-2 gap-3"
					@click="navigateTo(`/personalities/${person.id}`)">
					<div
						class="flex justify-center items-center w-20 h-20 rounded overflow-hidden shrink-0">
						<img
							class="w-full h-full object-cover"
							:src="
								person.avatar ||
								`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
									person.name
								)}`
							"
							alt="" />
					</div>
					<div class="flex flex-col justify-center">
						<h3
							class="text-sm font-medium text-gray-50 font-semibold">
							{{ person.name }}
						</h3>
						<p
							class="line-clamp-2 overflow-hidden text-ellipsis text-sm text-gray-200">
							{{ person.description }}
						</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

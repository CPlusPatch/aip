<script setup lang="ts">
const token = useCookie("token");

const personalities = (
	await useFetch("/api/personalities/", {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
	})
).data.value;

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
</script>

<template>
	<div
		class="bg-dark-400 !h-[100dvh] h-screen overflow-y-scroll no-scrollbar w-full h-full">
		<header class="relative isolate pt-16 w-full bg-dark-600">
			<div
				class="absolute inset-0 -z-10 overflow-hidden"
				aria-hidden="true">
				<div
					class="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
					<div
						class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-orange-500 to-red-600"
						style="
							clip-path: polygon(
								100% 38.5%,
								82.6% 100%,
								60.2% 37.7%,
								52.4% 32.1%,
								47.5% 41.8%,
								45.2% 65.6%,
								27.5% 23.4%,
								0.1% 35.3%,
								17.9% 0%,
								27.7% 23.4%,
								76.2% 2.5%,
								74.2% 56%,
								100% 38.5%
							);
						" />
				</div>
				<div class="absolute inset-x-0 bottom-0 h-px bg-gray-100/5" />
			</div>

			<div class="mx-auto max-w-6xl px-4 py-10 sm:px-8 lg:px-10">
				<div
					class="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
					<div class="flex items-center gap-x-6">
						<div
							class="h-16 w-16 flex items-center justify-center rounded ring-1 ring-gray-100/10 p-2">
							<Icon
								name="fluent-emoji:person-medium"
								class="w-12 h-12" />
						</div>
						<h1>
							<div
								class="mt-1 text-xl font-semibold leading-6 text-gray-50">
								Personalities
							</div>
							<div class="text-sm leading-6 text-gray-400">
								AI personalities
							</div>
						</h1>
					</div>
				</div>
			</div>
		</header>
		<div class="mx-auto max-w-6xl mt-20">
			<ul
				role="list"
				class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
				<li
					v-for="person in personalities"
					:key="person.id"
					class="col-span-1 flex flex-col divide-y divide-gray-700 rounded bg-dark-600 ring-2 ring-orange-500 text-center shadow">
					<div class="flex flex-1 flex-col p-6">
						<img
							class="mx-auto w-full aspect-1 flex-shrink-0 rounded"
							:src="person.avatar"
							alt="" />
						<h3 class="mt-6 text-sm font-medium text-gray-50">
							{{ person.name }}
						</h3>
						<dl
							class="mt-1 flex flex-grow flex-col justify-between">
							<dt class="sr-only">Title</dt>
							<dd class="text-sm text-gray-400">
								{{ person.description }}
							</dd>
							<dd class="mt-4">
								<NuxtLink :to="`/personalities/${person.id}`">
									<Button theme="orange" class="w-full"
										>Configure</Button
									>
								</NuxtLink>
							</dd>
						</dl>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

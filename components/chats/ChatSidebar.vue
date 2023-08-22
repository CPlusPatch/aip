<script setup lang="ts">
import { Chat } from "~/db/entities/Chat";
import { User } from "~/db/entities/User";

defineProps<{
	user: User;
}>();

const token = useCookie("token");

const chats = await useFetch("/api/chats/", {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token.value}`,
	},
});

const chatsList = ref(chats.data.value as Chat[]);

const deleteChat = (e: Event, id: number) => {
	e.stopPropagation();
	e.preventDefault();
	if (confirm("Are you sure you want to delete this chat?")) {
		fetch(`/api/chats/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token.value}`,
			},
		}).then(res => {
			if (res.ok) {
				chatsList.value = chatsList.value.filter(c => c.id !== id);

				// If on the deleted chat URL, navigate to the latest chat
				if (window.location.pathname === `/chats/${id}`) {
					const latestChat = chatsList.value[0];
					if (latestChat) {
						useRouter().push(`/chats/${latestChat.id}`);
					} else {
						useRouter().push("/chats");
					}
				}
			}
		});
	}
};

const cleanChats = () => {
	fetch(`/api/chats/clean`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
	}).then(async res => {
		if (res.ok) {
			chatsList.value = await res.json();

			// If current chat has been cleaned, navigate to the latest chat
			if (
				chatsList.value.filter(
					c => c.id === Number(window.location.pathname.split("/")[2])
				).length === 0
			) {
				const latestChat = chatsList.value[0];
				if (latestChat) {
					useRouter().push(`/chats/${latestChat.id}`);
				} else {
					useRouter().push("/");
				}
			}
		}
	});
};
</script>

<template>
	<div
		class="dark flex-shrink-0 bg-dark-800 font-['Inter'] block md:w-[268px] w-full h-full">
		<div
			class="max-h-screen w-full flex flex-col overflow-hidden border-white/20">
			<NuxtLink to="/" class="flex h-16 shrink-0 items-center px-2 mt-3">
				<img
					class="h-8 w-auto"
					src="https://uden.ai/assets/img/logo/loder.png"
					alt="Uden AI" />
			</NuxtLink>
			<div class="mb-1 flex flex-row gap-2 px-2 mt-3">
				<NuxtLink to="/" class="w-full">
					<Button theme="orange" class="w-full">
						<Icon name="tabler:plus" class="h-4 w-4 mr-2" />New chat
					</Button>
				</NuxtLink>
			</div>
			<nav
				class="overflow-y-scroll h-1/2 no-scrollbar w-full flex-col px-2 pb-2"
				aria-label="Chat history">
				<div class="flex-col flex-1 transition-opacity duration-500">
					<div class="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
						<div>
							<span>
								<div class="relative">
									<div
										class="sticky bg-dark-800 top-0 z-[16] flex flex-row justify-between items-center">
										<h3
											class="h-9 pb-2 pt-3 px-1 text-xs text-gray-500 font-medium text-ellipsis overflow-hidden break-all">
											Today
										</h3>
										<Icon
											title="Clean empty chats"
											name="tabler:trash"
											class="w-4 h-4 shrink-0 mr-1"
											@click="cleanChats" />
									</div>
									<ol class="flex flex-col gap-2 grow">
										<NuxtLink
											v-for="chat of chatsList"
											:key="chat.id"
											:to="`/chats/${chat.id}`">
											<Button
												theme="gray"
												class="w-full flex-row gap-2 !ring-dark-300 !font-normal">
												<Icon
													name="tabler:messages"
													class="w-4 h-4 shrink-0" />
												<span
													class="grow flex justify-start text-left whitespace-nowrap overflow-hidden text-ellipsis"
													>{{ chat.title }}</span
												>
												<Icon
													name="tabler:edit"
													class="w-4 h-4 shrink-0 cursor:pointer" />
												<Icon
													title="Delete Chat"
													name="tabler:trash"
													class="w-4 h-4 shrink-0"
													@click="
														deleteChat(
															$event,
															chat.id
														)
													" />
											</Button>
										</NuxtLink>
									</ol>
								</div>
							</span>
						</div>
					</div>
				</div>
			</nav>
			<div class="py-2 shrink-0 flex flex-col gap-4">
				<NuxtLink to="/personalities" class="w-full">
					<Button theme="gray" class="w-full">
						<Icon
							name="tabler:users"
							class="h-4 w-4 mr-2" />Personalities
					</Button>
				</NuxtLink>
				<NuxtLink to="/settings/user">
					<Button
						theme="gray"
						name=""
						class="flex flex-row gap-x-2 py-2 text-left w-full justify-between">
						<div class="flex items-center">
							<img
								class="inline-block h-9 w-9 rounded"
								:src="
									user?.avatar ||
									`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
										user.display_name
									)}`
								"
								alt="" />
							<div class="ml-3">
								<p
									class="text-sm font-medium text-gray-200 group-hover:text-gray-50">
									{{ user?.display_name }}
								</p>
								<p
									class="text-xs font-medium text-gray-400 group-hover:text-gray-200">
									View profile
								</p>
							</div>
						</div>
					</Button>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

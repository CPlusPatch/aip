<script setup lang="ts">
import { Client } from "~/packages/api";
import { Chat } from "~/db/entities/Chat";
import { User } from "~/db/entities/User";

defineProps<{
	user: User;
}>();

const token = useCookie("token");

const client = new Client(token.value ?? "");

const chats = ref(await client.getChats());

const chatsList = ref(chats.value as Chat[]);

const deleteChat = (e: Event, id: string) => {
	e.stopPropagation();
	e.preventDefault();
	if (confirm("Are you sure you want to delete this chat?")) {
		client.deleteChat(id).then(_ => {
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
		});
	}
};

const cleanChats = () => {
	client.cleanChats().then(chats => {
		chatsList.value = chats;

		// If current chat has been cleaned, navigate to the latest chat
		if (
			chatsList.value.filter(
				c => c.id === window.location.pathname.split("/")[2]
			).length === 0
		) {
			const latestChat = chatsList.value[0];
			if (latestChat) {
				useRouter().push(`/chats/${latestChat.id}`);
			} else {
				useRouter().push("/");
			}
		}
	});
};
</script>

<template>
	<div
		class="dark flex-shrink-0 bg-dark-800 font-['Inter'] block md:w-[268px] w-full h-full">
		<div
			class="max-h-screen !max-h-[100dvh] w-full h-full flex flex-col overflow-hidden border-white/20">
			<NuxtLink to="/" class="flex h-16 shrink-0 items-center px-2 mt-3">
				<img
					class="h-8 w-auto"
					src="https://uden.ai/assets/img/logo/loder.png"
					alt="Uden AI" />
			</NuxtLink>
			<div class="mb-1 flex flex-row gap-2 px-2 mt-3 shrink-0">
				<NuxtLink to="/" class="w-full">
					<Button theme="orange" class="w-full">
						<Icon name="tabler:plus" class="h-4 w-4 mr-2" />New chat
					</Button>
				</NuxtLink>
			</div>
			<nav
				class="overflow-y-scroll grow no-scrollbar w-full flex-col px-2 pb-2"
				aria-label="Chat history">
				<div class="flex-col h-full transition-opacity duration-500">
					<div class="flex flex-col gap-2 pb-2 text-gray-100 text-sm">
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
							<ol class="flex flex-col gap-2">
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
											class="grow text-gray-300 line-clamp-1 justify-start text-left whitespace-nowrap overflow-hidden text-ellipsis"
											>{{
												chat.messages.find(
													m => m.role === "user"
												)?.content || "Empty chat"
											}}</span
										>
										<Icon
											name="tabler:edit"
											class="w-4 h-4 shrink-0 !hidden cursor:pointer" />
										<Icon
											title="Delete Chat"
											name="tabler:trash"
											class="w-4 h-4 shrink-0"
											@click="
												deleteChat($event, chat.id)
											" />
									</Button>
								</NuxtLink>
							</ol>
						</div>
					</div>
				</div>
			</nav>
			<div class="p-2 shrink-0 flex flex-col gap-4">
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
								:src="user?.avatar"
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

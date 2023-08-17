<script setup lang="ts">
import { nanoid } from "nanoid";
import { Subscriptions, User } from "~/db/entities/User";

const props = defineProps<{
	id: number;
	user: User;
}>();

const token = useCookie("token");

const isLoading = ref(false);
const errorMessage = ref("");
const message = ref("");
const credits = ref(
	props.user.subscription === Subscriptions.PREMIUM
		? Infinity
		: props.user.credits
);
// const bottomOfChatRef = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const chat = await useFetch(`/api/chats/${props.id}/`, {
	headers: {
		"Content-Type": "application/json",
		Authorization: `Bearer ${token.value}`,
	},
});

if (!chat.data.value) {
	throw createError({
		statusCode: 404,
		message: "Chat not found",
	});
}

const messages = ref<
	{
		content: string;
		role: "user" | "system" | "assistant";
		id: string;
	}[]
>(chat.data.value.messages);

const sendMessage = async (e: Event) => {
	e.preventDefault();

	// Don't send empty messages
	if (message.value.length < 1) {
		errorMessage.value = "Please enter a message.";
		return;
	} else {
		errorMessage.value = "";
	}
	isLoading.value = true;

	// Add the message to the conversation
	messages.value.push({ content: message.value, role: "user", id: nanoid() });

	// Clear the message & remove empty chat
	message.value = "";

	try {
		const response = await fetch(
			`/api/chats/${chat.data.value?.id}/generate`,
			{
				method: "POST",
				body: JSON.stringify({
					messages: messages.value,
				}),
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token.value}`,
				},
			}
		);

		messages.value.push({
			content: "",
			role: "assistant",
			id: nanoid(),
		});

		const lastMessageFromSystemIndex = messages.value.findLastIndex(
			message => message.role === "assistant"
		);

		// Read stream from body and add the outputs to the last system message
		const reader = response.body?.getReader();
		if (reader) {
			let result = await reader.read();
			while (!result.done) {
				if (isLoading.value) isLoading.value = false;
				const decoder = new TextDecoder();
				const chunk = decoder.decode(result.value, { stream: true });
				credits.value -= chunk.length;
				if (credits.value < 0) {
					credits.value = 0;
				}
				messages.value[lastMessageFromSystemIndex].content += chunk;
				// If the message begins with a newline, remove it:
				if (
					messages.value[lastMessageFromSystemIndex].content[0] ===
					"\n"
				) {
					messages.value[lastMessageFromSystemIndex].content =
						messages.value[lastMessageFromSystemIndex].content
							.slice(1)
							.trim();
				}

				result = await reader.read();
			}
			// Add the last chunk
			const decoder = new TextDecoder();
			const chunk = decoder.decode(result.value, { stream: true });
			messages.value[lastMessageFromSystemIndex].content += chunk;
		}

		console.log(messages.value);
	} catch (error: any) {
		console.error(error);
		errorMessage.value = error.message;

		isLoading.value = false;
	}
};

const handleKeypress = (e: KeyboardEvent) => {
	// It's triggered by pressing the enter key
	if (e.key === "Enter" && !e.shiftKey) {
		sendMessage(e);
		e.preventDefault();
	}
};

onMounted(() => {
	if (textareaRef.value) {
		textareaRef.value.style.height = "24px";
		textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
	}
});

const emit = defineEmits<{
	(event: "sidebar-toggle"): void;
}>();

const buyPremium = () => {
	useFetch(`/api/billing/order`, {
		method: "POST",
		body: JSON.stringify({
			product: "PREMIUM",
		}),
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
	}).then(res => {
		res.data.value?.url && window.open(res.data.value.url, "_blank");
	});
};
</script>

<template>
	<div class="flex h-full max-w-full flex-1 flex-col dark font-['Inter']">
		<main
			class="relative h-full w-full transition-width flex flex-col overflow-auto items-stretch flex-1">
			<div class="flex-1 overflow-hidden">
				<div
					class="h-full dark:bg-dark-400 overflow-scroll no-scrollbar">
					<div class="flex flex-col text-sm oveflow-y-scroll pb-10">
						<header
							class="sticky top-0 z-[9] w-full"
							data-projection-id="11"
							style="top: 0px; transform: translateY(0%)">
							<div
								class="relative z-20 flex min-h-[60px] flex-wrap items-center justify-between gap-3 border-b border-black/10 bg-white p-2 text-gray-500 dark:border-gray-900/50 dark:bg-dark-800 dark:text-gray-300">
								<div class="md:hidden flex">
									<Button
										theme="gray"
										class="!px-2 !py-2"
										@click="emit('sidebar-toggle')">
										<Icon
											name="tabler:menu"
											class="w-6 h-6" />
									</Button>
								</div>
								<div
									class="flex flex-1 flex-grow items-center gap-1 p-1 text-gray-600 dark:text-gray-200 sm:justify-center sm:p-0">
									<span>Default (Pro Uncensored)</span>
								</div>
								<div class="flex flex-shrink flex-row">
									<Button
										theme="gray"
										:class="[
											user.subscription ===
												Subscriptions.PREMIUM &&
												'!bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500',
										]"
										@click="buyPremium">
										<Icon
											name="tabler:cpu"
											class="h-4 w-4 mr-1" />
										{{
											user.subscription ===
											Subscriptions.NONE
												? credits ?? 0
												: "Infinity"
										}}
									</Button>
								</div>
							</div>
						</header>
						<ChatsChatMessage
							v-for="message of messages.filter(
								m => m.role !== 'system'
							) as any"
							:key="message.id"
							:message="message!"
							:user="user" />
						<div
							v-if="isLoading"
							class="flex flex-row mx-auto py-5 text-gray-100 items-center gap-3">
							<Spinner class="fill-orange-500 text-dark-50" />
							Generating...
						</div>
						<div
							v-if="credits <= 0"
							class="mx-auto py-5 text-gray-100 text-center">
							<Icon name="fluent-emoji:warning" class="mr-1" />
							You are out of credits!
							<button class="underline" @click="buyPremium">
								Click here
							</button>
							to purchase AIP Supporter for unlimited access
						</div>
						<div class="h-32 md:h-48 flex-shrink-0"></div>
					</div>
				</div>
			</div>
			<div
				class="absolute bottom-0 pt-20 left-0 w-full bg-gradient-to-b from-transparent to-dark-600 bg-transparent dark:md:bg-vert-dark-gradient pt-2 md:pl-2 md:w-[calc(100%-.5rem)]">
				<form
					class="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
					<div
						class="relative flex h-full flex-1 items-stretch md:flex-col"
						role="presentation">
						<div
							class="flex flex-row items-center w-full flex-grow px-2 py-2 focus-within:ring-2 ring-orange-500 duration-200 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-dark-100 rounded-lg shadow-xs dark:shadow-xs">
							<textarea
								ref="textareaRef"
								v-model="message"
								tabindex="0"
								rows="1"
								:disabled="credits <= 0"
								placeholder="Send a message"
								class="m-0 grow disabled:cursor-not-allowed resize-none ml-2 border-0 bg-transparent p-0 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pr-12 pl-3 md:pl-0"
								style="
									max-height: 200px;
									height: 24px;
									overflow-y: hidden;
								"
								@keydown="handleKeypress"></textarea
							><button
								class="p-1 rounded-md dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent disabled:text-gray-400 enabled:bg-brand-purple text-white transition-colors disabled:opacity-40"
								:disabled="message.length === 0 || credits <= 0"
								@click="sendMessage">
								<Icon
									name="tabler:send"
									class="h-4 w-4 m-1 md:m-0" />
							</button>
						</div>
					</div>
				</form>
				<div
					class="pb-3 pt-2 text-center text-xs text-gray-600 dark:text-gray-300 md:px-[60px] md:pb-6 md:pt-3">
					<span
						>May produce inaccurate output. Exercice caution during
						usage.</span
					>
				</div>
			</div>
		</main>
	</div>
</template>

<style>
.prose :where(p, ul, ol, pre):not(:where(.not-prose, .not-prose *)) {
	margin: 0;
}

.prose :where(h3):not(:where(.not-prose, .not-prose *)) {
	margin: 0.5em 0 0.5em;
	font-size: 1.375em;
}

.prose :where(h2):not(:where(.not-prose, .not-prose *)) {
	margin: 0.5em 0 0.5em;
	font-size: 1.375em;
}
</style>

<script setup lang="ts">
import { marked } from "marked";
import { User } from "~/db/entities/User";

const showCopyButtonCheck = ref(false);

const props = defineProps<{
	message: {
		content: string;
		role: "user" | "assistant" | "system";
		id: string;
		date: number;
	};
	nextMessage: {
		content: string;
		role: "user" | "assistant" | "system";
		id: string;
		date: number;
	} | null;
	user: User;
}>();

const messageDate = useDateFormat(props.message.date, "hh:mm");

const copyText = (text: string) => {
	navigator.clipboard.writeText(text);
	showCopyButtonCheck.value = true;
	setTimeout(() => {
		showCopyButtonCheck.value = false;
	}, 1000);
};

const emit = defineEmits<{
	(event: "redact", id: string): void;
}>();

const elementHook = ref<HTMLElement | null>(null);

const isActionbarShown = ref(false);

onLongPress(
	elementHook,
	() => {
		isActionbarShown.value = true;
	},
	{
		delay: 100,
	}
);
</script>

<template>
	<div
		v-if="false"
		:class="[
			'group w-full border-b dark:border-dark-50/50',
			message.role === 'assistant' ? '!bg-dark-300' : '',
		]">
		<div
			class="flex p-4 gap-4 text-base md:gap-6 md:max-w-2xl lg:max-w-[38rem] xl:max-w-3xl md:py-6 lg:px-0 m-auto">
			<div class="flex-shrink-0 flex flex-col relative items-end">
				<div class="w-[30px]">
					<div class="relative flex items-center h-8 w-8">
						<div
							v-if="message.role === 'assistant'"
							class="bg-orange-600 p-1 w-full h-full text-white rounded flex items-center justify-center">
							<Icon name="tabler:brain" class="w-5.5 h-5.5" />
						</div>
						<img
							v-else
							alt="User"
							loading="lazy"
							:src="
								user?.avatar ||
								`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
									user.display_name
								)}`
							"
							class="rounded w-full h-full" />
					</div>
				</div>
			</div>
			<div
				class="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
				<div class="flex flex-grow flex-col gap-3">
					<div
						class="min-h-[20px] flex flex-col items-start gap-3 overflow-x-auto whitespace-pre-wrap break-words">
						<div
							class="empty:hidden text-gray-200 prose"
							v-html="
								marked(message.content.trim(), {
									headerIds: false,
									mangle: false,
								})
							"></div>
					</div>
				</div>
				<div
					class="text-gray-400 flex self-end lg:self-center justify-center mt-2 gap-2 md:gap-3 lg:gap-1 lg:absolute lg:top-0 lg:translate-x-full lg:right-0 lg:mt-0 lg:pl-2 visible">
					<button
						title="Copy Text"
						class="!p-1.5 flex items-center justify-center rounded-md text-gray-400 hover:bg-dark-700 hover:text-gray-200 md:invisible md:group-hover:visible"
						@click="copyText(message.content.trim())">
						<Icon
							:name="
								showCopyButtonCheck
									? 'tabler:check'
									: 'tabler:copy'
							"
							class="h-4 w-4" />
					</button>
					<button
						title="Redact message"
						class="!p-1.5 flex items-center justify-center rounded-md text-gray-400 hover:bg-dark-700 hover:text-gray-200 md:invisible md:group-hover:visible"
						@click="emit('redact', message.id)">
						<Icon name="tabler:trash" class="h-4 w-4" />
					</button>
				</div>
				<div class="flex justify-between lg:block"></div>
			</div>
		</div>
	</div>
	<div
		v-else
		class="w-full flex flex-row max-w-6xl mx-auto py-1 px-3 first-of-type:mt-10">
		<transition
			enter-active-class="duration-200"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
			leave-active-class="duration-200">
			<div
				v-if="isActionbarShown"
				class="fixed z-50 bg-dark-800/60 inset-0 backdrop-blur-lg"
				@mousedown="isActionbarShown = false"></div>
		</transition>
		<div
			ref="elementHook"
			:class="[
				'max-w-80 md:max-w-120 px-4 py-2 rounded-xl text-white w-fit flex chat-tail flex-col relative gap-1',
				message.role === 'user'
					? 'ml-auto bg-dark-100 rounded-br-none chat-bubble-user'
					: 'bg-orange-500 rounded-bl-none chat-bubble-assistant',
				isActionbarShown && 'z-60',
			]">
			<transition
				enter-active-class="duration-200"
				enter-from-class="opacity-0"
				enter-to-class="opacity-100"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0"
				leave-active-class="duration-200">
				<div
					v-if="isActionbarShown"
					class="absolute -top-14 right-0 p-3 rounded-xl bg-dark-300 gap-2 flex flex-row items-center children:flex children:items-center text-xl">
					<button>
						<Icon name="tabler:clipboard" />
					</button>
					<button>
						<Icon name="tabler:trash" />
					</button>
				</div>
			</transition>
			<div
				:class="[
					message.role === 'user' ? '' : '',
					'text-base break-words shrink inline-block whitespace-pre-wrap',
				]">
				{{ message.content }}
			</div>
			<div class="text-xs ml-auto flex flex-row items-center gap-1">
				<span
					:class="
						message.role === 'user'
							? 'text-gray-500'
							: 'text-gray-100'
					"
					>{{ messageDate }}</span
				>
				<Icon name="tabler:circle-check-filled" />
			</div>
		</div>
	</div>
</template>

<style>
.chat-tail.chat-bubble-user::before {
	-webkit-mask-image: url("data:image/svg+xml,%3csvg width='3' height='3' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m 0 3 L 1 3 L 3 3 C 2 3 0 1 0 0'/%3e%3c/svg%3e");
	mask-image: url("data:image/svg+xml,%3csvg width='3' height='3' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m 0 3 L 1 3 L 3 3 C 2 3 0 1 0 0'/%3e%3c/svg%3e");
	left: 99%;
	position: absolute;
	bottom: 0px;
	height: 0.75rem;
	width: 0.75rem;
	background-color: inherit;
	content: "";
	-webkit-mask-size: contain;
	mask-size: contain;
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-position: center;
}

.chat-tail.chat-bubble-assistant::before {
	-webkit-mask-image: url("data:image/svg+xml,%3csvg width='3' height='3' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m 0 3 L 3 3 L 3 0 C 3 1 1 3 0 3'/%3e%3c/svg%3e");
	mask-image: url("data:image/svg+xml,%3csvg width='3' height='3' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill='black' d='m 0 3 L 3 3 L 3 0 C 3 1 1 3 0 3'/%3e%3c/svg%3e");
	left: -0.71rem;
	position: absolute;
	bottom: 0px;
	height: 0.75rem;
	width: 0.75rem;
	background-color: inherit;
	content: "";
	-webkit-mask-size: contain;
	mask-size: contain;
	-webkit-mask-repeat: no-repeat;
	mask-repeat: no-repeat;
	-webkit-mask-position: center;
	mask-position: center;
}
</style>

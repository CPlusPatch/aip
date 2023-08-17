<script setup lang="ts">
import { marked } from "marked";
import { User } from "~/db/entities/User";

const showCopyButtonCheck = ref(false);

defineProps<{
	message: {
		content: string;
		role: "user" | "assistant";
		id: string;
	};
	user: User;
}>();

const copyText = (text: string) => {
	navigator.clipboard.writeText(text);
	showCopyButtonCheck.value = true;
	setTimeout(() => {
		showCopyButtonCheck.value = false;
	}, 1000);
};
</script>

<template>
	<div
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
							:src="user?.avatar"
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
				</div>
				<div class="flex justify-between lg:block"></div>
			</div>
		</div>
	</div>
</template>

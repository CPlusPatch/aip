<script setup lang="ts">
import { NotificationType } from "./Snackbar.vue";

defineProps<{
	notif: {
		uuid: string;
		type: NotificationType;
		content: any;
		show: boolean;
		icon: any;
	};
}>();
</script>

<template>
	<div
		class="max-w-sm bg-white/875 backdrop-blur-lg dark:bg-dark-700/75 shadow-lg rounded border dark:border-gray-700 overflow-hidden">
		<div class="px-3 py-2">
			<div class="flex items-center gap-x-3 flex-row">
				<Icon
					:name="notif.icon"
					aria-hidden="true"
					class="w-4 h-4 text-gray-700 dark:text-gray-300" />
				<p
					class="text-base font-medium text-gray-900 dark:text-gray-100 mt-0.5">
					{{ notif.content }}
				</p>
			</div>
		</div>
	</div>
</template>

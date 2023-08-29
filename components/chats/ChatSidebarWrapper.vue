<script setup lang="ts">
import { User } from "~/db/entities/User";

const { width } = useWindowSize();

defineProps<{
	user: User;
	open: boolean;
}>();

const emit = defineEmits(["close"]);
</script>

<template>
	<ChatsChatSidebar v-if="width > 768" :user="user" />

	<HeadlessTransitionRoot v-else appear :show="open">
		<HeadlessDialog
			as="div"
			class="overflow-hidden fixed inset-0 z-50"
			@close="emit('close')">
			<div class="overflow-hidden absolute inset-0">
				<HeadlessTransitionChild
					enter="ease-in-out duration-300"
					enter-from="opacity-0"
					enter-to="opacity-100"
					leave="ease-in-out duration-300"
					leave-from="opacity-100"
					leave-to="opacity-0">
					<HeadlessDialogOverlay
						class="fixed inset-0 bg-transparent transition-opacity backdrop-blur-md" />
				</HeadlessTransitionChild>

				<div
					class="flex fixed inset-y-0 right-0 pr-10 w-full pointer-events-none font-inter">
					<HeadlessTransitionChild
						enter="transform transition ease-in-out duration-300 sm:duration-300"
						enter-from="-translate-x-full"
						enter-to="translate-x-0"
						leave="transform transition ease-in-out duration-300 sm:duration-300"
						leave-from="translate-x-0"
						leave-to="-translate-x-full"
						class="w-screen max-w-sm pointer-events-auto">
						<ChatsChatSidebar :user="user" />
					</HeadlessTransitionChild>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>

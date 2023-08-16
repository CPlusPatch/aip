<script setup lang="ts">
import Notification from "./Notification.vue";
import { nanoid } from "nanoid";
</script>

<script lang="ts">
export enum NotificationType {
	Normal,
	NewMention,
	Error,
}

const notifications = ref<
	{
		uuid: string;
		type: NotificationType;
		content: any;
		show: boolean;
		icon: any;
	}[]
>([]);

export const addNotification = (
	content: any,
	type?: NotificationType,
	icon?: string
) => {
	const uuid = nanoid();
	notifications.value.push({
		type: type ?? NotificationType.Normal,
		uuid,
		content,
		show: true,
		icon: icon ?? undefined,
	});

	setTimeout(() => {
		const notif = notifications.value.find(n => n.uuid === uuid);
		if (notif) notif.show = false;
		setTimeout(() => {
			notifications.value = notifications.value.filter(
				n => n.uuid !== uuid
			);
		}, 500);
	}, 4000);
};
</script>

<template>
	<!-- Global notification live region, render this permanently at the end of the document -->
	<div
		aria-live="assertive"
		class="fixed inset-0 flex px-4 py-6 pointer-events-none sm:p-6 items-start z-[99999999]">
		<div class="w-full flex flex-col items-center space-y-3 sm:items-start">
			<TransitionGroup
				enter-active-class="ease-out duration-300"
				enter-from-class="translate-y-2 opacity-0 sm:-translate-x-2"
				enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
				leave-active-class="ease-in duration-100"
				leave-from-class="opacity-100 sm:translate-x-0"
				leave-to-class="opacity-0 sm:-translate-x-2">
			
				<Notification
					v-for="notif of notifications"
					:key="notif.uuid"
					:appear="true"
					:notif="notif">
				</Notification>
			</TransitionGroup>
		</div>
	</div>
</template>

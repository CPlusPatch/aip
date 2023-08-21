<script setup lang="ts">
import { Subscriptions, User } from "~/db/entities/User";
import { models } from "~/utils/models";

const props = defineProps<{
	model: string;
	user: User;
}>();

const emit = defineEmits<{
	(event: "update:model", model: string): void;
	(event: "click"): void;
}>();

const selected = ref(models.find(m => m.model === props.model) ?? models[0]);

const updateModel = (option: any) => {
	emit("update:model", option.model);
	emit("click");
};
</script>

<template>
	<HeadlessListbox v-model="selected" as="div">
		<HeadlessListboxLabel class="sr-only"
			>Change published status</HeadlessListboxLabel
		>
		<div class="relative">
			<div
				class="inline-flex divide-x divide-orange-700 rounded-md shadow-sm">
				<div
					class="inline-flex items-center gap-x-1.5 rounded-l-md bg-orange-600 px-3 py-2 text-white shadow-sm">
					<Icon
						name="tabler:check"
						class="-ml-0.5 h-5 w-5 hidden md:block"
						aria-hidden="true" />
					<p class="text-sm font-semibold md:block hidden">
						{{ selected.name }}
					</p>
					<p class="text-sm font-semibold block md:hidden">
						{{ selected.smallName }}
					</p>
				</div>
				<HeadlessListboxButton
					class="inline-flex items-center rounded-l-none rounded-r-md !bg-orange-600 p-2 hover:!bg-orange-700 focus:outline-none">
					<span class="sr-only">Change published status</span>
					<Icon
						name="tabler:chevron-down"
						class="h-5 w-5 text-white"
						aria-hidden="true" />
				</HeadlessListboxButton>
			</div>

			<transition
				leave-active-class="transition ease-in duration-100"
				leave-from-class="opacity-100"
				leave-to-class="opacity-0">
				<HeadlessListboxOptions
					class="absolute left-0 z-10 mt-2 bg-dark-400 w-72 origin-top-right divide-y divide-dark-200 overflow-hidden rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<HeadlessListboxOption
						v-for="option in models"
						:key="option.name"
						v-slot="{ selected }"
						as="template"
						:value="option"
						:disabled="!option.tiers?.includes(user.subscription)"
						@click="
							option.tiers?.includes(user.subscription) &&
								updateModel(option)
						">
						<li
							:class="[
								selected
									? 'bg-orange-600'
									: 'bg-dark-400 hover:bg-dark-500',
								'cursor-default duration-100 select-none text-white p-4 text-sm',
								!option.tiers?.includes(user.subscription) &&
									'opacity-50',
							]">
							<div class="flex flex-col">
								<div class="flex justify-between">
									<p
										:class="
											selected
												? 'font-semibold'
												: 'font-normal'
										">
										{{ option.name }}
									</p>
									<span
										v-if="
											!option.tiers.includes(
												Subscriptions.NONE
											)
										"
										class="inline-flex items-center flex gap-1 rounded-md bg-yellow-900 px-2 py-1 text-xs font-medium text-yellow-100 ring-1 ring-inset ring-yellow-300/20"
										><Icon
											name="fluent-emoji:crown"
											class="mb-0.5" />Supporter</span
									>
									<span
										v-if="selected"
										:class="
											selected
												? 'text-white'
												: 'text-orange-600'
										">
										<Icon
											name="tabler:check"
											class="h-5 w-5"
											aria-hidden="true" />
									</span>
								</div>
								<p
									:class="[
										selected
											? 'text-orange-100'
											: 'text-gray-400',
										'mt-2',
									]">
									{{ option.description }}
								</p>
							</div>
						</li>
					</HeadlessListboxOption>
				</HeadlessListboxOptions>
			</transition>
		</div>
	</HeadlessListbox>
</template>

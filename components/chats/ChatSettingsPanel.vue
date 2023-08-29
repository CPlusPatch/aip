<script setup lang="ts">
import { User } from "~/db/entities/User";
import { Personality } from "~/db/entities/Personality";
import { Client } from "~/packages/api";

const token = useCookie("token");
const client = new Client(token.value ?? "");

const props = defineProps<{
	user: User;
	model: string;
	personality: any | null;
	open: boolean;
	temperature: number;
}>();

const emit = defineEmits<{
	(event: "update:model", model: string): void;
	(event: "update:personality", personality: Personality): void;
	(event: "update:open", open: boolean): void;
	(event: "update:temperature", temperature: number): void;
}>();

const personalities = await client.getPersonalities();

const query = ref("");
const selectedPerson = ref<Personality | null>(props.personality || null);
const filteredPeople = computed(() =>
	query.value === ""
		? personalities
		: personalities.filter(person => {
				return person.name
					.toLowerCase()
					.includes(query.value.toLowerCase());
		  })
);

watch(selectedPerson, () => {
	emit("update:personality", selectedPerson.value as any);
});
</script>

<template>
	<HeadlessTransitionRoot as="template" :show="open">
		<HeadlessDialog
			as="div"
			class="relative z-50 dark"
			@close="emit('update:open', false)">
			<HeadlessTransitionChild
				as="template"
				enter="ease-in-out duration-500"
				enter-from="opacity-0"
				enter-to="opacity-100"
				leave="ease-in-out duration-500"
				leave-from="opacity-100"
				leave-to="opacity-0">
				<div
					class="fixed inset-0 bg-dark-500 bg-opacity-75 transition-opacity" />
			</HeadlessTransitionChild>

			<div class="fixed inset-0 overflow-hidden">
				<div class="absolute inset-0 overflow-hidden">
					<div
						class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
						<HeadlessTransitionChild
							as="template"
							enter="transform transition ease-in-out duration-500 sm:duration-700"
							enter-from="translate-x-full"
							enter-to="translate-x-0"
							leave="transform transition ease-in-out duration-500 sm:duration-700"
							leave-from="translate-x-0"
							leave-to="translate-x-full">
							<HeadlessDialogPanel
								class="pointer-events-auto w-screen max-w-md">
								<form
									class="flex h-full flex-col divide-y divide-gray-700 bg-dark-400 border-2 rounded border-orange-500 shadow-xl">
									<div class="h-0 flex-1 overflow-y-auto">
										<div
											class="bg-dark-700 px-4 py-6 sm:px-6">
											<div
												class="flex items-center justify-between">
												<HeadlessDialogTitle
													class="text-base font-semibold leading-6 text-white"
													>New
													chat</HeadlessDialogTitle
												>
											</div>
										</div>
										<div
											class="flex flex-1 flex-col justify-between">
											<div
												class="divide-y divide-gray-200 px-4 sm:px-6">
												<div
													class="space-y-6 pb-5 pt-6">
													<div>
														<label
															class="block text-sm font-medium leading-6 text-gray-200 mb-2"
															>Model type</label
														>
														<ChatsModelSelector
															:model="model"
															:user="user"
															@update:model="
																newModel =>
																	emit(
																		'update:model',
																		newModel
																	)
															" />
													</div>

													<HeadlessCombobox
														v-model="selectedPerson"
														nullable
														as="div">
														<HeadlessComboboxLabel
															class="block text-sm font-medium leading-6 text-gray-50"
															>Personality</HeadlessComboboxLabel
														>
														<div
															class="relative mt-2">
															<HeadlessComboboxInput
																class="w-full rounded-md border-0 bg-white/5 py-1.5 pl-3 pr-12 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-orange-500 sm:text-sm sm:leading-6"
																:display-value="
																	(
																		selectedPerson: any
																	) =>
																		selectedPerson?.name
																"
																@change="
																	query =
																		$event
																			.target
																			.value
																" />
															<HeadlessComboboxButton
																class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
																<Icon
																	name="tabler:chevron-down"
																	class="h-5 w-5 text-gray-500"
																	aria-hidden="true" />
															</HeadlessComboboxButton>

															<transition
																enter-active-class="transition duration-100 ease-out"
																enter-from-class="transform scale-95 opacity-0"
																enter-to-class="transform scale-100 opacity-100"
																leave-active-class="transition duration-75 ease-out"
																leave-from-class="transform scale-100 opacity-100"
																leave-to-class="transform scale-95 opacity-0">
																<HeadlessComboboxOptions
																	v-if="
																		filteredPeople.length >
																		0
																	"
																	class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-dark-200 py-1 text-base shadow-lg ring-1 ring-white ring-opacity-5 focus:outline-none sm:text-sm">
																	<HeadlessComboboxOption
																		v-for="person in filteredPeople"
																		:key="
																			person.id
																		"
																		v-slot="{
																			active,
																			selected,
																		}"
																		:value="
																			person
																		"
																		as="template">
																		<li
																			:class="[
																				'relative cursor-default select-none py-2 pl-3 pr-9',
																				active
																					? 'bg-orange-500 text-white'
																					: 'text-gray-200',
																			]">
																			<div
																				class="flex items-center">
																				<img
																					:src="
																						person.avatar
																					"
																					alt=""
																					class="h-6 w-6 flex-shrink-0 rounded" />
																				<span
																					:class="[
																						'ml-3 truncate',
																						selected &&
																							'font-semibold',
																					]">
																					{{
																						person.name
																					}}
																				</span>
																			</div>

																			<span
																				v-if="
																					selected
																				"
																				:class="[
																					'absolute inset-y-0 right-0 flex items-center pr-4',
																					active
																						? 'text-white'
																						: 'text-orane-600',
																				]">
																				<Icon
																					name="tabler:check"
																					class="h-5 w-5"
																					aria-hidden="true" />
																			</span>
																		</li>
																	</HeadlessComboboxOption>
																</HeadlessComboboxOptions>
															</transition>
														</div>
													</HeadlessCombobox>

													<div>
														<label
															class="block text-sm font-medium leading-6 text-gray-200 mb-2"
															>Temperature</label
														>

														<div
															class="flex gap-2 text-sm text-gray-200 items-center">
															<input
																type="number"
																class="bg-dark-800 rounded py-1 w-18 px-2"
																:value="
																	temperature
																"
																min="0.1"
																max="0.95"
																step="0.05"
																@input="
																	emit(
																		'update:temperature',
																		Number(
																			(
																				$event as any
																			)
																				.target
																				.value
																		)
																	)
																" />
															<input
																type="range"
																min="0.1"
																:value="
																	temperature
																"
																step="0.05"
																max="0.95"
																class="w-full h-1 bg-gray-200 grow rounded appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
																@input="
																	emit(
																		'update:temperature',
																		Number(
																			(
																				$event as any
																			)
																				.target
																				.value
																		)
																	)
																" />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div
										class="flex flex-shrink-0 justify-end px-4 py-4 gap-2">
										<Button
											type="button"
											theme="orange"
											class="w-full"
											@click="emit('update:open', false)">
											Close
										</Button>
									</div>
								</form>
							</HeadlessDialogPanel>
						</HeadlessTransitionChild>
					</div>
				</div>
			</div>
		</HeadlessDialog>
	</HeadlessTransitionRoot>
</template>

<script setup lang="ts">
import { User } from "~/db/entities/User";
import { Personality } from "~/db/entities/Personality";

defineProps<{
	user: User;
	model: string;
	personality: Personality | null;
	open: boolean;
	temperature: number;
}>();

const emit = defineEmits<{
	(event: "update:model", model: string): void;
	(event: "update:personality", personality: Personality): void;
	(event: "update:open", open: boolean): void;
	(event: "update:temperature", temperature: number): void;
}>();
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
													<!-- <div>
														<label
															for="project-name"
															class="block text-sm font-medium leading-6 text-gray-200"
															>Project name</label
														>
														<div class="mt-2">
															<InputCMInput
																id="project-name"
																type="text"
																name="project-name" />
														</div>
													</div> -->

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

<script setup lang="ts">
import { User } from "~/db/entities/User";

const user = (await useFetch(`/api/user/get`)).data.value as User;

if (!user)
	navigateTo(
		"/auth/login?" +
			new URLSearchParams({
				next: "/",
			})
	);

const navigation = [
	{
		name: "User Settings",
		href: "/settings/user",
		icon: "tabler:home",
		count: "5",
		current: true,
	},
	{
		name: "Invoices",
		href: "/settings/invoice",
		icon: "tabler:file-description",
		current: false,
	},
];
</script>

<template>
	<div class="flex flex-row dark no-scrollbar">
		<div class="hidden xl:flex xl:w-70 xl:flex-col">
			<!-- Sidebar component, swap this element with another sidebar if you like -->
			<div
				class="flex grow flex-col gap-y-5 overflow-y-auto bg-dark-800 px-4 border-r border-dark-200">
				<div class="flex h-16 shrink-0 items-center px-2 mt-3">
					<img
						class="h-8 w-auto"
						src="https://uden.ai/assets/img/logo/loder.png"
						alt="Uden AI" />
				</div>
				<nav class="flex flex-1 flex-col">
					<ul role="list" class="flex flex-1 flex-col gap-y-7">
						<li>
							<ul role="list" class="space-y-2">
								<li v-for="item in navigation" :key="item.name">
									<Button
										theme="gray"
										:class="[
											'group flex gap-x-3 w-full !justify-start',
										]">
										<Icon
											:name="item.icon"
											class="h-5 w-5 shrink-0"
											aria-hidden="true" />
										{{ item.name }}
									</Button>
								</li>
							</ul>
						</li>
						<li class="py-2 empty:hidden mt-auto w-full">
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
								<Icon
									name="ic:round-keyboard-arrow-down"
									:class="[
										'-mr-1 duration-200 h-5 w-5 text-gray-400',
										false ? 'rotate-0' : 'rotate-180',
									]"
									aria-hidden="true" />
							</Button>
						</li>
					</ul>
				</nav>
			</div>
		</div>
		<slot />
	</div>
</template>

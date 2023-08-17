<script setup lang="ts">
import { User } from "~/db/entities/User";

const user = (await useFetch(`/api/user/get`)).data.value as User;

definePageMeta({
	layout: "account",
});

const invoice = {
	subTotal: "$10.00",
	tax: "$0.0",
	total: "$10.00",
	items: [
		{
			id: 1,
			title: "AIP Supporter",
			description: "AIP Supporter subscription",
			price: "$10.00/month",
		},
	],
};
</script>

<template>
	<main class="bg-dark-400 max-h-screen overflow-scroll no-scrollbar grow">
		<header class="relative isolate pt-16">
			<div
				class="absolute inset-0 -z-10 overflow-hidden"
				aria-hidden="true">
				<div
					class="absolute left-16 top-full -mt-16 transform-gpu opacity-50 blur-3xl xl:left-1/2 xl:-ml-80">
					<div
						class="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-orange-500 to-red-600"
						style="
							clip-path: polygon(
								100% 38.5%,
								82.6% 100%,
								60.2% 37.7%,
								52.4% 32.1%,
								47.5% 41.8%,
								45.2% 65.6%,
								27.5% 23.4%,
								0.1% 35.3%,
								17.9% 0%,
								27.7% 23.4%,
								76.2% 2.5%,
								74.2% 56%,
								100% 38.5%
							);
						" />
				</div>
				<div class="absolute inset-x-0 bottom-0 h-px bg-gray-100/5" />
			</div>

			<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
				<div
					class="mx-auto flex max-w-2xl items-center justify-between gap-x-8 lg:mx-0 lg:max-w-none">
					<div class="flex items-center gap-x-6">
						<img
							src="https://uden.ai/assets/img/logo/loder.png"
							alt=""
							class="h-16 w-16 flex-none rounded ring-1 ring-gray-100/10 p-2" />
						<h1>
							<div class="text-sm leading-6 text-gray-400">
								Invoice
								<span class="text-gray-200">#00011</span>
							</div>
							<div
								class="mt-1 text-base font-semibold leading-6 text-gray-50">
								Uden AI
							</div>
						</h1>
					</div>
				</div>
			</div>
		</header>

		<div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-dark-400">
			<div
				class="mx-auto grid max-w-2xl grid-cols-1 grid-rows-1 items-start gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
				<!-- Invoice summary -->
				<div class="lg:col-start-3 lg:row-end-1">
					<h2 class="sr-only">Summary</h2>
					<div
						class="rounded-lg shadow-sm ring-1 bg-dark-700 ring-gray-50/5">
						<dl class="flex flex-wrap">
							<div class="flex-auto pl-6 pt-6">
								<dt
									class="text-sm font-semibold leading-6 text-gray-50">
									Amount
								</dt>
								<dd
									class="mt-1 text-base font-semibold leading-6 text-gray-50">
									$10.00
								</dd>
							</div>
							<div class="flex-none self-end px-6 pt-4">
								<dt class="sr-only">Status</dt>
								<dd
									class="rounded-md bg-green-900 px-2 py-1 text-xs font-medium text-green-300 ring-1 ring-inset ring-green-200/20">
									Paid
								</dd>
							</div>
							<div
								class="mt-6 flex w-full flex-none gap-x-4 border-t border-gray-50/5 px-6 pt-6">
								<dt class="flex-none">
									<span class="sr-only">Client</span>
									<Icon
										name="tabler:user"
										class="h-6 w-5 text-gray-300"
										aria-hidden="true" />
								</dt>
								<dd
									class="text-sm font-medium leading-6 text-gray-50">
									{{ user.display_name }}
								</dd>
							</div>
							<div
								class="mt-4 flex w-full flex-none gap-x-4 px-6">
								<dt class="flex-none">
									<span class="sr-only">Due date</span>
									<Icon
										name="tabler:calendar"
										class="h-6 w-5 text-gray-300"
										aria-hidden="true" />
								</dt>
								<dd class="text-sm leading-6 text-gray-400">
									<time datetime="2023-01-31"
										>January 31, 2023</time
									>
								</dd>
							</div>
							<div
								class="mt-4 flex w-full flex-none gap-x-4 px-6">
								<dt class="flex-none">
									<span class="sr-only">Status</span>
									<Icon
										name="tabler:credit-card"
										class="h-6 w-5 text-gray-300"
										aria-hidden="true" />
								</dt>
								<dd class="text-sm leading-6 text-gray-400">
									Paid with MasterCard
								</dd>
							</div>
						</dl>
						<div class="mt-6 border-t border-gray-50/5 px-6 py-6">
							<a
								href="#"
								class="text-sm font-semibold leading-6 text-gray-50"
								>Download receipt
								<span aria-hidden="true">&rarr;</span></a
							>
						</div>
					</div>
				</div>

				<!-- Invoice -->
				<div
					class="-mx-4 px-4 py-8 bg-dark-700 shadow-sm ring-1 ring-gray-50/5 sm:mx-0 sm:rounded-lg sm:px-8 sm:pb-14 lg:col-span-2 lg:row-span-2 lg:row-end-2 xl:px-16 xl:pb-20 xl:pt-16">
					<h2 class="text-base font-semibold leading-6 text-gray-50">
						Invoice
					</h2>
					<dl
						class="mt-6 grid grid-cols-1 text-sm leading-6 sm:grid-cols-2">
						<div class="sm:pr-4">
							<dt class="inline text-gray-400">Issued on</dt>
							{{ " " }}
							<dd class="inline text-gray-200">
								<time datetime="2023-23-01"
									>January 23, 2023</time
								>
							</dd>
						</div>
						<div class="mt-2 sm:mt-0 sm:pl-4">
							<dt class="inline text-gray-400">Due on</dt>
							{{ " " }}
							<dd class="inline text-gray-200">
								<time datetime="2023-31-01"
									>January 31, 2023</time
								>
							</dd>
						</div>
						<div
							class="mt-6 border-t border-gray-50/5 pt-6 sm:pr-4">
							<dt class="font-semibold text-gray-50">From</dt>
							<dd class="mt-2 text-gray-400">
								<span class="font-medium text-gray-50"
									>Acme, Inc.</span
								><br />7363 Cynthia Pass<br />Toronto, ON N3Y
								4H8
							</dd>
						</div>
						<div
							class="mt-8 sm:mt-6 sm:border-t sm:border-gray-50/5 sm:pl-4 sm:pt-6">
							<dt class="font-semibold text-gray-50">To</dt>
							<dd class="mt-2 text-gray-400">
								<span class="font-medium text-gray-50"
									>Tuple, Inc</span
								><br />886 Walter Street<br />New York, NY 12345
							</dd>
						</div>
					</dl>
					<table
						class="mt-16 w-full whitespace-nowrap text-left text-sm leading-6">
						<colgroup>
							<col class="w-full" />
							<col />
							<col />
							<col />
						</colgroup>
						<thead class="border-b border-gray-700 text-gray-50">
							<tr>
								<th scope="col" class="px-0 py-3 font-semibold">
									Projects
								</th>
								<th
									scope="col"
									class="py-3 pl-8 pr-0 text-right font-semibold">
									Price
								</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="item in invoice.items"
								:key="item.id"
								class="border-b border-gray-800">
								<td class="max-w-0 px-0 py-5 align-top">
									<div
										class="truncate font-medium text-gray-50">
										{{ item.title }}
									</div>
									<div class="truncate text-gray-400">
										{{ item.description }}
									</div>
								</td>
								<td
									class="py-5 pl-8 pr-0 text-right align-top tabular-nums text-gray-200">
									{{ item.price }}
								</td>
							</tr>
						</tbody>
						<tfoot>
							<tr>
								<th
									scope="row"
									colspan="3"
									class="hidden px-0 pb-0 pt-6 text-right font-normal text-gray-200 sm:table-cell">
									Subtotal
								</th>
								<td
									class="pb-0 pl-8 pr-0 pt-6 text-right tabular-nums text-gray-50">
									{{ invoice.subTotal }}
								</td>
							</tr>
							<tr>
								<th
									scope="row"
									colspan="3"
									class="hidden pt-4 text-right font-normal text-gray-200 sm:table-cell">
									Tax
								</th>
								<td
									class="pb-0 pl-8 pr-0 pt-4 text-right tabular-nums text-gray-200">
									{{ invoice.tax }}
								</td>
							</tr>
							<tr>
								<th
									scope="row"
									colspan="3"
									class="hidden pt-4 text-right font-semibold text-gray-50 sm:table-cell">
									Total
								</th>
								<td
									class="pb-0 pl-8 pr-0 pt-4 text-right font-semibold tabular-nums text-gray-50">
									{{ invoice.total }}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</div>
		</div>
	</main>
</template>

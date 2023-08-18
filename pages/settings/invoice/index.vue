<script setup lang="ts">
const token = useCookie("token");

const invoices = (
	await useFetch(`/api/billing/invoice/`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
	})
).data.value;

definePageMeta({
	layout: "account",
});

useHead({
	title: `Invoices · AIP`,
});
</script>

<template>
	<div class="grow h-screen p-4">
		Invoices:
		<ol>
			<li v-for="invoice of invoices" :key="invoice.id">
				<NuxtLink :to="`/settings/invoice/${invoice.id}`"
					>Invoice #{{ invoice.data?.number }}</NuxtLink
				>
			</li>
		</ol>
	</div>
</template>

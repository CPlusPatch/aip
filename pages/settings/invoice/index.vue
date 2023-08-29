<script setup lang="ts">
import { Client } from "~/packages/api";

const token = useCookie("token");

const client = new Client(token.value ?? "");

const invoices = await client.getInvoices();

definePageMeta({
	layout: "account",
});

useHead({
	title: `Invoices · AIP`,
});
</script>

<template>
	<div class="grow h-screen p-4 !h-[100dvh]">
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

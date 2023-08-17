<script setup lang="ts">
import { User } from "~/db/entities/User";
import { Invoice } from "~/db/entities/Invoice";

const user = (await useFetch(`/api/user/get`)).data.value as User;
const token = useCookie("token");

const invoices = (
	await useFetch(`/api/billing/invoice/`, {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token.value}`,
		},
	})
).data.value as Invoice[];

definePageMeta({
	layout: "account",
});
</script>

<template>
	<div class="grow h-screen">
		Invoices:
		<ol>
			<li v-for="invoice of invoices" :key="invoice.id">
				<NuxtLink :to="`/settings/invoice/${invoice.id}`"
					>Invoice #{{ invoice.data.number }}</NuxtLink
				>
			</li>
		</ol>
	</div>
</template>

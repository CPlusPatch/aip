<script setup lang="ts">
import { getSettings } from "~/utils/utilities";

const isOnline = useOnline();
</script>

<template>
	<main class="overflow-hidden w-full h-screen relative flex">
		<slot />>
	</main>
</template>

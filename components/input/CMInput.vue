<script setup lang="ts">
import { InputHTMLAttributes } from "nuxt/dist/app/compat/capi";

interface InputProps extends /* @vue-ignore */ InputHTMLAttributes {
	loading?: boolean;
	name: string;
	icon?: string;
	hideIcon?: boolean;
}

const props = defineProps<InputProps>();
</script>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>

<template>
	<div class="relative">
		<input
			:name="props.name"
			:disabled="props.loading"
			:class="[
				'block peer pr-3 py-1.5 focus:ring-2 ring-1 ring-dark-100 !border-transparent focus:ring-orange-500 border border-dark-300 placeholder:text-gray-400 w-full pl-3 bg-white/5 text-white rounded-md shadow-sm duration-200 outline-none disabled:opacity-50 focus:outline-none text-sm leading-6',
				props.icon && (props.hideIcon ? 'focus:pl-8' : 'pl-8'),
			]"
			v-bind="$attrs" />
		<div
			v-if="icon"
			:class="[
				'absolute left-8.5 inset-y-0 flex items-center -translate-x-7 duration-200',
				props.hideIcon ? 'peer-focus:translate-x-0' : 'translate-x-0',
			]">
			<Icon :name="icon" class="w-5 h-5 text-gray-400" />
		</div>
	</div>
</template>

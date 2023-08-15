// https://nuxt.com/docs/api/configuration/nuxt-config
import { nodePolyfills } from "vite-plugin-node-polyfills";
import "reflect-metadata";

export default defineNuxtConfig({
	modules: [
		"@nuxtjs/robots",
		"@unocss/nuxt",
		"nuxt-headlessui",
		"nuxt-icon",
		"@vueuse/nuxt",
	],
	hooks: {
		"nitro:build:before": nitro => {
			nitro.options.moduleSideEffects.push("reflect-metadata");
		},
	},
	app: {
		head: {
			link: [
				{
					rel: "icon",
					href: "/favicon.png",
					type: "image/png",
				},
			],
			htmlAttrs: { lang: "en-us" },
		},
	},
	ssr: false,
	nitro: {
		compressPublicAssets: true,
		routeRules: {
			"/_nuxt/**": {
				headers: {
					"cache-control": `public,max-age=${
						60 * 60 * 24 * 365
					},s-maxage=${60 * 60 * 24 * 365}`,
				},
			},
		},
		esbuild: {
			options: {
				tsconfigRaw: {
					compilerOptions: {
						experimentalDecorators: true,
					},
				},
			},
		},
	},
	runtimeConfig: {
		public: {
			siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
			siteName: "",
			siteDescription: "",
			language: "en-US", // prefer more explicit language codes like `en-AU` over `en`,
			titleSeparator: "·",
		},
	},
	vite: {
		plugins: [
			nodePolyfills({
				// To exclude specific polyfills, add them to this list.
				exclude: [],
				// Whether to polyfill `node:` protocol imports.
				protocolImports: true,
			}),
		],
		resolve: {
			extensions: [
				".mjs",
				".js",
				".mts",
				".ts",
				".jsx",
				".tsx",
				".json",
				".vue",
			],
		},
	},
});

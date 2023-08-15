// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";
import { getConfig } from "~/utils/config";

export default defineEventHandler(async event => {
	event.node.res.writeHead(200, { "Content-Type": "text/plain" });

	const messages = await readBody<{
		messages: { role: string; content: string }[];
	}>(event);

	const config = getConfig();

	const openai = new OpenAI({
		apiKey: "",
		baseURL: `${config.ai.base_url}/v1`,
	});

	const stream = await openai.chat.completions.create({
		messages: messages as any,
		model: config.ai.model,
		stream: true,
		max_tokens: 4096,
	});

	for await (const part of stream) {
		event.node.res.write(part.choices[0]?.delta?.content || "");
	}

	event.node.res.end();
});

import { factorial } from './calculations';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async fetch(request, env, ctx): Promise<Response> {
        let datetime = new Date().toISOString();
        const url = new URL(request.url);
        const foo = url.searchParams.get('input');
        let responseText = `${datetime}: Value of foo: ${foo}`;

        if (foo !== null && !isNaN(Number(foo))) {
            const bar = Number(foo);
            responseText += `Factorial of ${bar}: ${factorial(bar)}`;
        } else {
            responseText += "Unable to calculate factorial";
        }

        let response = await fetch(`https://01161500.monoraillime.xyz`);
        let newResponse = new Response(response.body, response)
        newResponse.headers.set("From-My-Worker", "True");
        newResponse.headers.set("Cache-Tag", "rhamilton1510");
        newResponse.headers.set("X-cf", JSON.stringify(response.cf));
        return newResponse;
	},
} satisfies ExportedHandler<Env>;

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
let cache = caches.default;

export default {
	async fetch(request, env, ctx): Promise<Response> {
        let originUrl = `https://01161500.monoraillime.xyz`;
        let cacheKey = originUrl + "myWorker";
        let cachedResponse = await cache.match(cacheKey);
        if (cachedResponse) {
            let clonedCachedResponse = cachedResponse.clone();
            clonedCachedResponse.headers.set("Returning-From-Cache", "True");
            console.log("Returning cached response");
            return clonedCachedResponse;
        }
        console.log("No cached response found, fetching from origin");

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

        let response = await fetch(originUrl, {
            cf: {
                cacheKey: cacheKey
            }
        });
        let newResponse = new Response(response.body, response)
        newResponse.headers.set("From-My-Worker", "True");
        newResponse.headers.set("Cache-Tag", "rhamilton1510");
        newResponse.headers.set("X-cf", JSON.stringify(response.cf));
        newResponse.headers.set("X-host-metadata", request.cf?.hostMetadata ? JSON.stringify(request.cf.hostMetadata) : "No host metadata");
        cache.put(cacheKey, newResponse.clone())
        return newResponse;
	},
} satisfies ExportedHandler<Env>;

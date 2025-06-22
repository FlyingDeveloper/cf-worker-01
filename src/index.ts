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
        let url = "https://01161500.monoraillime.xyz/";
        let beReq = new Request(url);
        let beResp = await fetch(beReq, { cf: { cacheEverything: true }});
        let headers = "";
        beResp.headers.forEach((val, key) => {
            headers += `${key}: ${val}<br />`;
        })
        //let cacheStatus = beResp.headers.get("cf-cache-status");
        let respText = `Hello, world! The factorial of 5 is ${factorial(5)}.<br />${headers}`;
        let resp = new Response(`<html><head></head><body><p>${respText}</p></body></html>`);
        resp.headers.set("Content-Type", "text/html; charset=UTF-8");
        return resp;
	},
} satisfies ExportedHandler<Env>;

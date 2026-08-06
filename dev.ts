#!/usr/bin/env -S deno run -A --watch=static/,routes/

import "https://deno.land/std@0.216.0/dotenv/load.ts";
import dev from "$fresh/dev.ts";

await dev(import.meta.url, "./main.ts");



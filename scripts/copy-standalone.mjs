import { cp, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const staticSource = ".next/static";
const staticTarget = ".next/standalone/.next/static";
const publicSource = "public";
const publicTarget = ".next/standalone/public";

if (!existsSync(".next/standalone/server.js")) {
  console.error("Standalone server was not generated. Check the Next.js build output.");
  process.exit(1);
}

await mkdir(".next/standalone/.next", { recursive: true });
if (existsSync(staticSource)) {
  await cp(staticSource, staticTarget, { recursive: true, force: true });
}
if (existsSync(publicSource)) {
  await cp(publicSource, publicTarget, { recursive: true, force: true });
}
console.log("Standalone server assets copied successfully.");

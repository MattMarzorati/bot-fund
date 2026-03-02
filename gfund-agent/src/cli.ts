import "dotenv/config";
import { runOnce } from "./job.js";
import { runScheduler } from "./scheduler.js";

async function main(): Promise<void> {
  if (process.argv.includes("--run-once")) {
    await runOnce();
    return;
  }

  await runScheduler();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

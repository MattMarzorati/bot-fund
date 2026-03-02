import cron from "node-cron";
import { runOnce } from "./job.js";

export async function runScheduler(): Promise<void> {
  const task = cron.schedule(
    "0 8 * * *",
    async () => {
      try {
        await runOnce();
      } catch (error) {
        console.error("Scheduled run failed", error);
      }
    },
    {
      timezone: "Europe/Rome"
    }
  );

  task.start();
  console.log("gFund scheduler started: daily at 08:00 Europe/Rome");

  if (process.env.RUN_IMMEDIATELY === "1") {
    await runOnce();
  }
}

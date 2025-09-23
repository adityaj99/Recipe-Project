import cron from "node-cron";
import userModel from "../models/user.models.js";
import checkAndAwardBadges from "../uitls/awardBadges.js";

const badgeCron = () => {
  cron.schedule("0 0 * * 0", async () => {
    console.log("🔁 Weekly badge check started...");

    const users = await userModel.find();

    for (const user of users) {
      await checkAndAwardBadges(user._id);
    }

    console.log("✅ Weekly badge check completed.");
  });
};

export default badgeCron;

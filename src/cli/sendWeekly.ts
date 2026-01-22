//flow:
//await ingestDeals()
//await ingestUsers()
//const deals = await selectDeals()
//for each user:
//  const filtered = filterByUser(deals, user)
//  if filtered not empty:
//    generate email
//    send email

import { ingestDeals } from "../ingest/ingestDeals";
import { ingestUsers } from "../ingest/ingestUsers";
import { selectDeals } from "../logic/selectDeals";
import { filterByUser } from "../logic/filterByUser";
import { generateEmail } from "../email/template";
import { sendEmail } from "../email/sendEmail";
import { supabase } from "../db/client";
import { User } from "../types/user";


async function run() {
  await ingestDeals();
  await ingestUsers();

  const deals = await selectDeals();

  console.log("Loaded deals:", deals.length);
  
  const { data: rawUsers, error } = await supabase
    .from("users")
    .select("email, preferred_retailers");

  if (error || !rawUsers) {
    throw new Error("Failed to load users");
  }

  // Runtime guard + type narrowing
  const users: User[] = rawUsers.filter(
    (u): u is User =>
      Array.isArray(u.preferred_retailers) &&
      typeof u.email === "string"
  );

  for (const user of users || []) {
    const grouped = filterByUser(deals, user);

    console.log(
      "User:",
      user.email,
      "prefs:",
      user.preferred_retailers
    );

    if (Object.keys(grouped).length === 0) {
      console.log(`No deals for ${user.email}`);
      continue;
    }

    if (user.email !== "mihir.kaush@gmail.com") {
      console.log("Skipping non-test email:", user.email);
      continue;
    }

    const { html, text } = generateEmail(user, grouped);

    await sendEmail(
      user.email,
      "Your Weekly Grocery Deals",
      html,
      text
    );

    console.log(`Sent email to ${user.email}`);

    await new Promise(res => setTimeout(res, 600));

  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});



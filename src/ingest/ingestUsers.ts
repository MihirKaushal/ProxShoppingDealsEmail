// This file sets up test users so the filtering logic can be demonstrated end to end.

//Load users.json.
//Insert users with onConflict: email.

import fs from "fs";
import path from "path";
import { supabase } from "../db/client";

type RawUser = {
  name: string;
  email: string;
  preferred_retailers: string[];
};

export async function ingestUsers() {
  const filePath = path.join(__dirname, "../../data/users.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const users: RawUser[] = JSON.parse(raw);

  for (const user of users) {
    await supabase.from("users").upsert(
      {
        name: user.name,
        email: user.email,
        preferred_retailers: user.preferred_retailers,
      },
      { onConflict: "email" }
    );
  }

  console.log("User ingestion complete");
}

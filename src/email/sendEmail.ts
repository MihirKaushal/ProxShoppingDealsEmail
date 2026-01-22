// This file is a thin wrapper around the email provider. 
// If we switched providers, only this file would change.

//Initialize Resend client.
//Pass subject, html, and text.
//Log success or error.

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
) {
  console.log("Sending email to:", to);

  const result = await resend.emails.send({
    // This sender ALWAYS works for testing
    from: "Prox <onboarding@resend.dev>",
    to,
    subject,
    html,
    text,
  });

  console.log("Resend result:", result);
}
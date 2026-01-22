# Prox Deals → Email Automation

This project builds an end-to-end backend system that ingests weekly grocery deal data, stores it in a database, filters deals based on user preferences, and sends branded weekly deal emails.

The goal is to demonstrate data ingestion, relational modeling, business logic, and automated email delivery using a clean developer experience.

---

## Tech Stack

* Node.js + TypeScript
* Supabase (Postgres)
* Resend (email delivery)
* ts-node for CLI execution

---

## Database Schema

```
retailers
---------
id (uuid, pk)
name (text, unique)

products
--------
id (uuid, pk)
name (text)
size (text)
category (text)


deals
-----
id (uuid, pk)
retailer_id (fk -> retailers.id)
product_id (fk -> products.id)
price (numeric)
start_date (date)
end_date (date)
created_at (timestamp)


users (optional)
-----
id (uuid, pk)
email (text)
preferred_retailers (text[])
```

Relationships:

* A retailer has many deals
* A product can appear in many deals
* A deal joins exactly one retailer and one product

---

## Setup Instructions

### 1. Install dependencies

```
npm install
```

### 2. Environment variables

Create a `.env` file at the project root:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
RESEND_API_KEY=your_resend_api_key
```

Note: When using a free Resend account, emails can only be sent to the verified test email.

---

## Running the Project

To run the full weekly flow:

```
npm run send:weekly
```

This command will:

1. Ingest sample deal data into Supabase
2. Load users and their preferred retailers
3. Select active deals
4. Filter deals per user preferences
5. Generate branded HTML emails
6. Send emails to test recipients

Console logs show each stage of the pipeline for easy debugging.

---

## Email Behavior

* Only active deals within the date range are selected
* Deals are sorted by lowest price
* Each user receives deals only from their preferred retailers
* Emails show up to the top 6 deals
* HTML and plain-text versions are both included

Brand colors used:

* Primary: #0FB872
* Dark: #0A4D3C
* Background: #F4FBF8

---

## What I’d Build Next

* Add a small preview web page that renders the same deals shown in the email
* Introduce unit price calculations where size is parseable
* Improve deduplication by enforcing unique DB constraints
* Add a simple scraper for one retailer that outputs normalized deal JSON
* Add retry and backoff logic for email sends
* Add basic analytics logging for opens and send success

---

## Notes

This project focuses on correctness, clarity, and reliability rather than scale. The structure is designed to be easy to extend into scheduled jobs, live scrapers, and a user-facing preferences UI.

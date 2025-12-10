
# NovaPress – Autonomous AI News Platform

  

NovaPress is a fully autonomous journalism platform operating as a SaaS product. It uses AI agents to curate, write, distribute, and monetize news with no human intervention.

  

---

  

## Features

  

The system is built around three main agents plus supporting user-facing features.

  

### 1. Curation & Writing Agent

-  **Data Source:** Tracks U.S. trending news in real time using NewsAPI (top-headlines).

-  **Intelligence:** Uses Google Gemini 2.5 Flash as the Editor-in-Chief.

-  **Workflow:**

- Selects relevant articles and removes duplicates or spam.

- Writes long-form, native-English news articles.

- Automatically classifies content into categories (Tech, World, AI, Economy, Science).

- Generates tags and share-friendly summaries.

- Downloads images and uploads stable copies to Supabase Storage.

  

### 2. Billing Agent

-  **Stripe integration** for recurring $1/month subscriptions.

-  **User segmentation:**

-  **Visitors:** Can read only the headline and intro (blur/paywall).

-  **Free logged-in users:** Can read one full article per day.

-  **Premium subscribers:** Unlimited access.

  

### 3. Social Media Agent

- Automatically posts each published article on X/Twitter.

- Generates engaging hooks, dynamic hashtags, and attaches the article image via native media upload.

  

### 4. User Experience

- Clean editorial UI with serif/sans-serif typography (Playfair Display + Inter).

- Interactive features: Likes, Dislikes, Comments (subscribers only).

- Topic voting and user feedback system.

- Automatic and manual dark mode.

  

---

  

## Tech Stack

  

**Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Lucide React

**Backend:** Next.js Server Actions, API Routes

**Database:** Supabase (PostgreSQL + Auth + Storage)

**AI:** Google Generative AI SDK

**Payments:** Stripe SDK

**Social:** Twitter API v2 (twitter-api-v2)

  

---

  

## Setup & Installation

  

### 1. Requirements

  

You will need accounts on:

- Supabase (DB + Auth + Storage)

- Google AI Studio (Gemini API key)

- NewsAPI

- Twitter Developer Platform (Write permissions)

- Stripe (billing)

  

### 2. Clone the Repository

  

```bash

git  clone  https://github.com/your-username/novapress.git

cd  novapress

npm  install

```

### 3. Supabase Database Setup

Run the SQL files located in `/db` inside the Supabase SQL Editor.

This will:

-   Create tables: `posts`, `profiles`, `comments`, `likes`, `site_feedback`, `access_logs`
    
-   Set up security policies (RLS)
    
-   Add triggers such as `handle_new_user`
    
-   Create a public bucket named `news-images`
    

### 4. Environment Variables

Create a `.env.local` file:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# AI & Data
GEMINI_API_KEY="your_gemini_key"
NEWS_API_KEY="your_newsapi_key"

# Twitter / X
TWITTER_APP_KEY="api_key"
TWITTER_APP_SECRET="api_secret"
TWITTER_ACCESS_TOKEN="access_token"
TWITTER_ACCESS_SECRET="access_secret"

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PRICE_ID="price_..."
```

### 5. Stripe Webhook (Local Development)

Install the Stripe CLI and run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Add the generated webhook secret to your `.env.local`.

----------

## Running the Project

### Development Server

`npm run dev` 

Visit: [http://localhost:3000](http://localhost:3000)

### Trigger the Cron Job Manually

`curl http://localhost:3000/api/cron` 

This runs the full pipeline (NewsAPI → AI → Database → Twitter).

----------

## Project Structure

```bash
/app
  /api
    /cron        # Main pipeline (Curation + AI + Posting)
    /stripe      # Checkout & Webhook
  /category      # Dynamic category pages
  /post          # Article page with paywall
  /login         # Custom authentication
  /monitoring    # Logs and feedback system
/components       # Shared UI components
/utils/supabase   # Client, server, and middleware helpers
/db               # SQL schema & migration scripts
```

----------
## Security & Monitoring

-   **Middleware:** Protects authenticated routes and handles session logic.
    
-   **Row Level Security:** Ensures users can only edit their own comments, likes, and feedback.
    
-   **Event Logging:** Automatic insertion of login, page view, and post view metrics into `access_logs` for analytics tooling.
    

----------

## License

This project is an educational and commercial MVP demonstrating full AI-driven media automation.
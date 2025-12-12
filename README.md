
# NovaPress – Autonomous AI News Platform

![Project Status](https://img.shields.io/badge/Status-Live-success)
![AI Model](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blue)
![Stack](https://img.shields.io/badge/Stack-Next.js_16_|_Supabase_|_Stripe-black)

### Live Demo
**You can find this site running here:** [https://thenovapress.vercel.app/](https://thenovapress.vercel.app/)

### Social Agent
**Follow the automated posts on X/Twitter:** [@NovaPressTT](https://x.com/NovaPressTT)

---

## About the Project

NovaPress is a fully autonomous journalism platform operating as a SaaS product. It utilizes a swarm of AI agents to curate, write, distribute, and monetize news with zero human intervention.

### How to Use the Live Demo

1.  **Create an Account:** Click on the login icon to sign up. You can create a free account to read 1 article per day.
2.  **Payments (Sandbox Mode):** The live version is connected to **Stripe Test Mode**.
    * To unlock unlimited access (Premium), click subscribe.
    * Use the Stripe test card: **`4242 4242 4242 4242`**, any future date, and any CVC.
    * **No real money will be charged.**
3.  **Logs & Feedback:** The system automatically collects anonymous usage metrics (views, clicks) and allows logged-in users to send feedback/feature requests.
4.  **Admin Dashboard:** There is a comprehensive BI Dashboard located at `/painel/admin`.
    * *Note:* Access is strictly restricted to specific administrator emails via RLS and server-side checks.

---

## The Architecture: Autonomous Agents

The system is built around three main agents plus supporting user-facing features.

### 1. Curation & Writing Agent
* **Data Source:** Tracks U.S. trending news in real-time using NewsAPI.
* **Intelligence:** Uses **Google Gemini 2.5 Flash** as the Editor-in-Chief.
* **Workflow:**
    * Selects relevant articles and filters spam.
    * Writes long-form, native-English news articles.
    * Classifies content (Tech, World, AI, Economy, Science).
    * Generates tags and summaries.
    * **Images:** Downloads original images and uploads them to Supabase Storage for permanence.

### 2. Billing Agent
* **Stripe Integration:** Handles recurring $1/month subscriptions via Webhooks.
* **User Segmentation (PLG):**
    * **Visitors:** Blurred content (Headline/Intro only).
    * **Free Users:** 1 full article per day limit.
    * **Premium:** Unlimited access + Commenting + Voting.

### 3. Social Media Agent
* **Distribution:** Automatically posts every new article to X (Twitter).
* **Engagement:** Generates viral hooks, uses dynamic hashtags, and uploads the article image natively to the platform.

### 4. Automation (Cron)
* The system runs a scheduled task every **2 hours**.
* It is triggered via **cron-job.org**, which securely hits the protected API endpoint to ensure fresh content throughout the day.

---

## Tech Stack

* **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Lucide React.
* **Backend:** Next.js Server Actions & API Routes.
* **Database:** Supabase (PostgreSQL) + Auth + Storage.
* **AI:** Google Generative AI SDK (`@google/generative-ai`).
* **Payments:** Stripe SDK.
* **Social:** Twitter API v2 (`twitter-api-v2`).

---

## Running Locally

If you want to clone and run this project on your machine:

### 1. Prerequisites
You will need API keys for:
* Supabase
* Google Gemini (AI Studio)
* NewsAPI
* Twitter Developer Portal
* Stripe

### 2. Installation
```bash
git clone https://github.com/samScriptt/novapress.git
cd novapress
npm install
```

### 3. Environment Variables

Create a `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_URL="sbp_url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sbp_anon"
SUPABASE_SERVICE_ROLE_KEY="sbp_service_role"

GEMINI_API_KEY="ai_key"
NEWS_API_KEY="news_key"

TWITTER_APP_KEY="x_key"
TWITTER_APP_SECRET="x_secret"
TWITTER_ACCESS_TOKEN="x_token"
TWITTER_ACCESS_SECRET="x_token_secret"

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test..."
STRIPE_SECRET_KEY="sk_test..."
STRIPE_WEBHOOK_SECRET="whsec..."
NEXT_PUBLIC_STRIPE_PRICE_ID="price_..."

CRON_SECRET="your_secure_password"
SITE_URL="http://localhost:3000"
```

### 4. Database Setup

Run the SQL scripts located in the `/db` folder inside your Supabase SQL Editor to create tables (posts, profiles, logs, feedback) and set up Row Level Security (RLS).

### 5. Run Development Server

```bash
npm run dev
```
Visit `http://localhost:3000`.

### 6. Trigger Agent Manually

To force the agent to run immediately:
```bash
curl http://localhost:3000/api/cron?key=YOUR_CRON_SECRET
```

## Security & Monitoring

-   **Middleware:** Protects authenticated routes.
    
-   **Row Level Security (RLS):** Ensures strict data isolation between users.
    
-   **Event Logging:** Automatic insertion of login, page view, and error metrics into `access_logs`.
    

----------

## License

This project is an educational and commercial MVP demonstrating full AI-driven media automation.
# Ascent — Habit & Recovery Guide

Ascent is a comprehensive daily habit tracker, sobriety & quit timer, visual exercise and healthy meal planner, personal documentation notebook, and supportive community platform with an integrated 24/7 AI Coach.

---

## ✨ Key Features

- **Sobriety & Habit Trackers**: Track daily habits (build) and recovery goals (quit smoking, alcohol, sugar, screen time, procrastination) with live second-by-second counters, money saved, and hours reclaimed.
- **Accurate Visual Exercise & Healthy Meal Plans**: Step-by-step plain-language movement diagrams, anatomical form cues, and daily macro/water tracking.
- **Reminders, Notifications & App Screen Override**: Multi-channel reminders (in-app, browser notifications, email, SMS text, and full-screen focus lock overrides) plus email subscription preferences for new features and weekly digests.
- **Emojis & Stickers Library (Plan-Tiered)**:
  - **Starter Plan ($5/mo)**: Built-in emojis and core recovery stickers.
  - **Plus & Pro Plans**: Upload custom image stickers from your device and search/browse internet stickers via live web sticker search.
- **Support Community, WhatsApp/Telegram & Direct Messaging**:
  - Optional 1-click links to join WhatsApp and Telegram peer support groups.
  - Community progress photo sharing and reactions.
  - Private Direct Messaging (DM) exclusive to the **Pro** tier with a privacy on/off toggle.
- **Personal Notes & Documentation Book**: Structured journaling templates, mood tags, emoji/sticker attachments, Markdown export, and AI summarization.
- **Custom Display & Accessibility**: 4 font styles, 6 reading text colors, 7 button themes, 4 text sizes, and brightness/color intensity sliders.
- **Flexible Payment Plans**: 3 tiers starting from **$5 USD/month**, **50% new-user discount**, **10% extra yearly discount**, and 5 payment channels (Card, PayPal, Bank Transfer, Apple/Google Pay, Crypto/USDT).

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ascent-habit-recovery-guide.git
cd ascent-habit-recovery-guide
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and add your Gemini API key:

```bash
cp .env.example .env
```

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 4. Run the full-stack development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📦 Production Build

```bash
npm run lint
npm run build
npm start
```

---

## 🌐 Publishing to GitHub

1. **Directly from Google AI Studio**: Click the **GitHub** icon in the top-right toolbar of Google AI Studio to export and publish this repository directly to your GitHub account.
2. **Via Git CLI**: Open the **Publish & Backup** modal inside the app to generate ready-to-copy Git commands with your custom GitHub username and repository name.

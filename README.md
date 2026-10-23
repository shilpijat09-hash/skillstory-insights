# Skillstory Insights

Build a complete, premium SaaS application called ResumeIQ — an AI Resume Review Agent powered by CrewAI.

Tech stack: React, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons and Supabase for future authentication and database integration.

Design a modern, responsive interface inspired by Linear and Stripe, using a clean white background, navy typography and violet accents.

Create the following pages:

Landing page with hero section, features, how it works and call-to-action buttons.

Sign-up and login pages with email/password, Google sign-in and email OTP options.

Email verification, forgot password and reset password pages.

Protected application dashboard with sidebar navigation.

Resume upload page supporting PDF and DOCX, with drag-and-drop, target job title and job description input.

Analysis progress page with realistic processing stages.

AI analysis report with resume score, extracted skills, strengths, weaknesses, missing keywords and actionable feedback.

Analysis history page with search, filters and report details.

Profile and account settings.

Requirements:

Make all navigation and visible buttons functional.

Create reusable components and typed TypeScript models.

Add loading, error, empty and success states.

Use realistic sample data for the initial prototype.

Separate mock analysis logic from API integration.

Do not fake successful authentication or claim mock data is a real AI analysis.

Make the interface fully responsive and accessible.

Prepare the architecture for Supabase Auth, Supabase Storage and a future Python FastAPI + CrewAI backend.

Do not expose API keys or secrets in frontend code.

First finish the core design system, landing page, authentication UI and dashboard. Then implement the upload and report workflow. Ensure the project builds successfully.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3ff78c01-d833-4aae-8c12-ce1da7d6c917).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

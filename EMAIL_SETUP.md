# Email Setup Instructions

The contact form is now configured to send emails using Resend. Follow these steps to set it up:

## 1. Install Resend Package

Run this command in your terminal:

```bash
npm install resend
```

## 2. Get Resend API Key

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free)
3. Navigate to API Keys in your dashboard
4. Create a new API key
5. Copy the API key

## 3. Set Environment Variables

### For Local Development

Create a `.env.local` file in the root of your project:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=Contact Form <noreply@yourdomain.com>
```

**Note:** For the `RESEND_FROM_EMAIL`, you need to:
- Use a domain you own, OR
- Use Resend's test domain: `onboarding@resend.dev` (for testing only)

### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add the following variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `RESEND_FROM_EMAIL`: Your sender email (e.g., `Contact Form <noreply@yourdomain.com>`)

## 4. Verify Domain (Optional but Recommended)

For production use, you should verify your domain in Resend:

1. Go to Resend Dashboard → Domains
2. Add your domain
3. Add the DNS records provided by Resend
4. Wait for verification
5. Update `RESEND_FROM_EMAIL` to use your verified domain

## 5. Verify Configuration

Check if your environment variables are set correctly:

**Local Development:**
- Visit: `http://localhost:3000/api/check-config`

**Production (Vercel):**
- Visit: `https://yourdomain.com/api/check-config`

This endpoint will show you:
- ✓ If `RESEND_API_KEY` is set
- ✓ If `RESEND_FROM_EMAIL` is set
- Current environment (development/production)

## 6. Test the Form

After setting up:
1. Start your development server: `npm run dev`
2. Verify config at `/api/check-config`
3. Fill out the contact form
4. Check your email inbox (info@rcdev.me)
5. You should receive the form submission

## Alternative Email Services

If you prefer a different email service, you can modify `app/api/contact/route.ts`:

### Using SendGrid
```bash
npm install @sendgrid/mail
```

### Using Nodemailer (SMTP)
```bash
npm install nodemailer
```

### Using Formspree (No backend needed)
- Sign up at [Formspree.io](https://formspree.io)
- Get your form endpoint
- Update the form to POST directly to Formspree

## Troubleshooting

- **"Email service not configured"**: Make sure `RESEND_API_KEY` is set in your environment variables
- **"Resend package not installed"**: Run `npm install resend`
- **Emails not arriving**: Check your Resend dashboard for delivery status and errors
- **Domain verification**: Make sure your sender email uses a verified domain in Resend

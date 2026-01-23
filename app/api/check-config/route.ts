import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    resendApiKey: !!process.env.RESEND_API_KEY,
    resendFromEmail: !!process.env.RESEND_FROM_EMAIL,
    nodeEnv: process.env.NODE_ENV || 'development',
  };

  const allConfigured = config.resendApiKey && config.resendFromEmail;

  return NextResponse.json({
    status: allConfigured ? 'configured' : 'missing',
    config: {
      resendApiKey: config.resendApiKey ? '✓ Set' : '✗ Missing',
      resendFromEmail: config.resendFromEmail ? `✓ Set (${process.env.RESEND_FROM_EMAIL})` : '✗ Missing',
      nodeEnv: config.nodeEnv,
    },
    message: allConfigured
      ? 'All email configuration is set correctly!'
      : 'Some environment variables are missing. Please check your .env.local file or Vercel environment variables.',
  });
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email using Resend
    // Make sure to install: npm install resend
    // And set RESEND_API_KEY in your environment variables
    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      if (!process.env.RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not set');
        return NextResponse.json(
          { error: 'Email service not configured. Please contact the site administrator.' },
          { status: 500 }
        );
      }

      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Contact Form <onboarding@resend.dev>',
        to: 'info@rcdev.me',
        replyTo: email,
        subject: `Contact Form Submission from ${name}`,
        html: `
          <h2 style="font-family: Arial, sans-serif; color: #171717;">New Contact Form Submission</h2>
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #171717;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
          </div>
        `,
        text: `New Contact Form Submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      });

      if (emailResult.error) {
        console.error('Resend error:', emailResult.error);
        return NextResponse.json(
          { error: 'Failed to send email. Please try again later.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: 'Form submitted successfully' },
        { status: 200 }
      );
    } catch (importError) {
      // If Resend is not installed, provide helpful error
      if (importError instanceof Error && importError.message.includes('Cannot find module')) {
        console.error('Resend package not installed');
        return NextResponse.json(
          { error: 'Email service not configured. Please install the resend package.' },
          { status: 500 }
        );
      }
      throw importError;
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

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
    // Check if environment variables are set
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json(
        { error: 'Email service not configured. Please contact the site administrator.' },
        { status: 500 }
      );
    }

    try {
      const { Resend } = await import('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const fromEmail = process.env.RESEND_FROM_EMAIL || 'Contact Form <onboarding@resend.dev>';
      
      console.log('Attempting to send email:', {
        from: fromEmail,
        to: 'info@rcdev.me',
        hasApiKey: !!process.env.RESEND_API_KEY,
      });

      const emailResult = await resend.emails.send({
        from: fromEmail,
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
        console.error('Resend API error:', JSON.stringify(emailResult.error, null, 2));
        return NextResponse.json(
          { 
            error: 'Failed to send email. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? emailResult.error : undefined
          },
          { status: 500 }
        );
      }

      console.log('Email sent successfully:', emailResult.data?.id);
      return NextResponse.json(
        { message: 'Form submitted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error sending email:', error);
      
      // If Resend is not installed, provide helpful error
      if (error instanceof Error && error.message.includes('Cannot find module')) {
        return NextResponse.json(
          { error: 'Email service not configured. Please install the resend package.' },
          { status: 500 }
        );
      }

      // Log the full error for debugging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Full error details:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to send message. Please try again later.',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}

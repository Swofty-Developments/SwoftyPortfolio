import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const data = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // You'll need to verify your domain
      to: 'admin@swofty.net',
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);
                color: white;
                padding: 30px;
                border-radius: 8px;
                margin-bottom: 30px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
              }
              .content {
                background: #f9f9f9;
                padding: 30px;
                border-radius: 8px;
                border: 1px solid #e0e0e0;
              }
              .field {
                margin-bottom: 20px;
              }
              .label {
                font-weight: 600;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 8px;
              }
              .value {
                font-size: 16px;
                color: #333;
                padding: 12px;
                background: white;
                border-radius: 4px;
                border: 1px solid #e0e0e0;
              }
              .message {
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                color: #666;
                font-size: 14px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🚀 New Contact Form Submission</h1>
            </div>

            <div class="content">
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <div class="label">Email</div>
                <div class="value">
                  <a href="mailto:${email}" style="color: #a855f7; text-decoration: none;">${email}</a>
                </div>
              </div>

              <div class="field">
                <div class="label">Message</div>
                <div class="value message">${message}</div>
              </div>
            </div>

            <div class="footer">
              Sent from your portfolio contact form
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}

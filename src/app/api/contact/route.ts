import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phoneNumber, email, message } = body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create a transporter using Gmail SMTP (same configuration as login)
    const emailUser = 'ubunerstudent@gmail.com';
    const emailPass = 'tshj vzsk qyoa tprc';
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    // Email content
    const mailOptions = {
      from: 'ubunerstudent@gmail.com',
      to: 'bakhtmuner06@gmail.com',
      subject: 'Portfolio Message',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
          <div style="background: linear-gradient(to right, #2563eb, #9333ea); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Message</h1>
            <p style="color: #e0e7ff; margin: 10px 0 0 0;">You have received a new message from your portfolio</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</h3>
              <p style="color: #374151; margin: 0; font-size: 16px; font-weight: 500;">${fullName}</p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Email</h3>
              <p style="color: #374151; margin: 0; font-size: 16px;">
                <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</h3>
              <p style="color: #374151; margin: 0; font-size: 16px;">
                <a href="tel:${phoneNumber}" style="color: #2563eb; text-decoration: none;">${phoneNumber}</a>
              </p>
            </div>
            
            <div style="margin-bottom: 0;">
              <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message</h3>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #2563eb;">
                <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">This message was sent from your portfolio contact form</p>
            <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} Bakht Munir. All rights reserved.</p>
          </div>
        </div>
      `,
      // Plain text version as fallback
      text: `
New Contact Message

Full Name: ${fullName}
Email: ${email}
Phone Number: ${phoneNumber}

Message:
${message}

---
This message was sent from your portfolio contact form
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
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

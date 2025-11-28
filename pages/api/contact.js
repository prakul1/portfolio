// pages/api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Non-POST request to /api/contact');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};
  console.log('Contact request body:', { name, email, message });

  if (!name || !email || !message) {
    console.log('Validation failed: missing fields');
    return res.status(400).json({ error: 'Missing name, email or message' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // verify connection configuration (this will reveal auth problems)
    await transporter.verify();
    console.log('Nodemailer transporter verified OK');

    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`, // send from your email for better deliverability
      replyTo: email,
      to: process.env.EMAIL_USER,
      subject: `New message from ${name}`,
      text: message,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <p>${message}</p>`,
    });

    console.log('Email sent:', info);
    return res.status(200).json({ success: true, info });
  } catch (err) {
    console.error('Email send error:', err);
    // return the error message (safe for local debugging)
    return res.status(500).json({ error: 'Email could not be sent', details: err.message || err });
  }
}

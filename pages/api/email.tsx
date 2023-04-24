import Mailgun from 'mailgun-js';

// Initialize Mailgun with your API key and domain
const mailgun = Mailgun({
  apiKey: "f8f3dbf2039e193812598e694daf068c-181449aa-b8599525",
  domain: process.env.MAILGUN_DOMAIN,
});

// The API endpoint to send an email
export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { to } = req.body;

  // Send the email
  try {
    await mailgun.messages().send({
      "from": 'Your Name <your-email@example.com>',
      to,
      "subject": "Documate Waitlist Confirmation",
      "text": "Thank you for joining our waitlist. We will send an email shortly when our second iteration is ready to launch!",
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
};
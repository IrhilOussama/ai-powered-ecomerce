import nodemailer from 'nodemailer';

export const sendResetEmail = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: 'DYANOO Password Reset',
    html: `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
  });
};

export const sendEmailVerification = async (to: string, link: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Confirm your new email",
    html: `<p>Click <a href="${link}">here</a> to confirm your new email address. This link expires in 15 minutes.</p>`,
  });
};

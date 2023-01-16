import nodemailer from 'nodemailer';

export const sendMail = (to: string, subject: string, text: string) => {
	const transporter = nodemailer.createTransport({
		service: 'hotmail',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD
		}
	});

	transporter.sendMail({ from: process.env.EMAIL, to, subject, html: text }, (err, _info) => {
		if (err) {
			console.error('Error: Failed to send an email');
			return;
		} else {
			// console.log(info); //rm later
			return true;
		}
	});
};

import nodemailer from "nodemailer";

export default async function(err, req, res, next) {
	try {
		const user = process.env.MAIL_USER;
		const pass = process.env.MAIL_PASSWORD;

		res.status(500).send();
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: { user, pass },
		});

		await transporter.sendMail({
			from: user,
			to: user,
			subject: `Server Error ${(new Date()).toString()}`,
			html: `<p>${err.stack}</p>`,
		});
		next();
	} catch (err) {
		throw err;
	}
}
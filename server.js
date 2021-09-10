import express from 'express'
import nodemailer from 'nodemailer'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => {
	res.send('<h1>Server is running!</h1>')
})

app.post('/send', async (req, res) => {
	const output = `
        <p>You have a new contact request!</p>
        <h3>Contact Details</h3>
        <ul>
            <li>Name: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>
        </ul>
    `

	let transporter = nodemailer.createTransport({
		service: 'Gmail',
		port: 465,
		secure: true, // true for 465, false for other ports
		auth: {
			user: process.env.USER_EMAIL, // generated ethereal user
			pass: process.env.PASSWORD, // generated ethereal password
		},
		tls: {
			rejectUnauthorized: false,
		},
	})

	const mailOptions = {
		from: '"Fred Foo 👻" <salia.courses@gmail.com>', // sender address
		to: 'salia.courses@gmail.com', // list of receivers
		subject: 'Hello ✔', // Subject line
		text: 'Hello world?', // plain text body
		html: output, // html body
	}

	// send mail with defined transport object
	await transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.status(200).json({
				message: 'Somthing went wrong!',
				status: 'error',
			})

			return console.log(error)
		}

		console.log('Message sent: %s', info.messageId)
		console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

		res.status(200).json({
			message: 'Your request successfully sent!',
			status: 'success',
		})
	})
})

app.listen(process.env.PORT || 5000, () => {
	console.log('Server is running!')
})

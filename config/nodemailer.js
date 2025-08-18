import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport ({
  host: 'mail.netangels.ru',
  port: '25',
  secure: false,
  auth : {
    user: 'admin@cadmap.su',
    pass: 'jkhfg8d1983'
  }
})

export const mailer = async (message) => {
  await transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err)
    console.log('email SENT', info)
    return
  })
}
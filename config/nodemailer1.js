const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport ({
  host: 'mail.netangels.ru',
  port: '25',
  secure: false,
  auth : {
    user: 'admin@cadmap.su',
    pass: 'jkhfg8d1983'
  }
})

module.exports = {
  mailer: async function mailer (message) {
  await transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err)
    console.log('ПИСЬМО отправлено')
    return
  })
}
}
const schedule = require('node-schedule')
const { counterMaker } = require('./ordersCounter')
const { authPkk } = require('./authPKKdata')
const { withMinifyClassnames } = require('nextjs-plugin-minify-css-classname');
const cluster = require('cluster');

if (cluster.isMaster) {

  // schedule.scheduleJob('*/15 * * * *', async function() {
  //   askserver()
  // })

  // schedule.scheduleJob('*/20 * * * *', async function() {
  //   authPkk()
  // })

  schedule.scheduleJob('*/3 * * * *', async function() {
    counterMaker()
  })
}

module.exports = withMinifyClassnames({
  // reactStrictMode: true,
  images: {
    domains: ['img.dmclk.ru'],
  },
    async headers() {
      return [
          {
              source: '/pkk',
              headers: [
                  {
                      key: 'Access-Control-Allow-Origin',
                      value: '*',
                  },
              ],
          },
      ];
  },
})


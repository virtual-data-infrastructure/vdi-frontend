const fs = require('fs')
module.exports = {
  transpileDependencies: true,
  devServer: {
    host: process.env.VUE_APP_HOST,
    port: process.env.VUE_APP_PORT,
    https: {
      key: fs.readFileSync(process.env.VUE_APP_CERTS_DIR + '/privkey.pem'),
      cert: fs.readFileSync(process.env.VUE_APP_CERTS_DIR + '/fullchain.pem'),
    }
  }
}

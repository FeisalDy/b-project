module.exports = app => {
  const futuresController = require('../controllers/account.controllers.js')

  var router = require('express').Router()

  router.post('/information', futuresController.getAccountInformation)
  router.post('/balance', futuresController.getFuturesAccountBalance)

  app.use('/api/account', router)
}

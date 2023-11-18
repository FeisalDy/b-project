module.exports = app => {
  const user = require('../controllers/user.controllers.js')

  var router = require('express').Router()

  router.post('/add', user.addUser)
  router.get('/get/:userId', user.getUser) // New endpoint for fetching a single user by ID
  router.get('/getAll', user.getAllUsers) // New endpoint for fetching all users
  router.put('/update/:userId', user.updateUser)
  router.delete('/delete/:userId', user.deleteUser) // New endpoint for deleting a user

  router.put('/update/:userId/apiPair/:apiPairId', user.updateApiPair) //

  app.use('/api/user', router)
}

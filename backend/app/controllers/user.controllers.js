const db = require('../models')
const User = db.user

//Add User
exports.addUser = (req, res) => {
  const { name, apiPairs } = req.body

  if (!name || !apiPairs || apiPairs.length === 0) {
    return res
      .status(400)
      .json({ message: 'Name and at least one API pair are required.' })
  }

  const newUser = new User({
    name: name,
    apiPairs: apiPairs
  })

  newUser
    .save()
    .then(savedUser => {
      res.status(201).json(savedUser)
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'Error adding user', error: error.message })
    })
}

//get user
exports.getUser = (req, res) => {
  const userId = req.params.userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' })
  }

  User.findById(userId)
    .then(foundUser => {
      if (!foundUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(foundUser)
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'Error fetching user', error: error.message })
    })
}

exports.getAllUsers = (req, res) => {
  User.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'Error fetching users', error: error.message })
    })
}

// Update user by ID
exports.updateUser = (req, res) => {
  const userId = req.params.userId
  const { name, apiPairs } = req.body

  // Validate if at least one field is provided
  if (!name && (!apiPairs || apiPairs.length === 0)) {
    return res.status(400).json({
      message: 'At least one field (name or apiPairs) is required for update.'
    })
  }

  // Construct the update object based on the provided fields
  const updateObject = {}
  if (name) {
    updateObject.name = name
  }
  if (apiPairs) {
    updateObject.apiPairs = apiPairs
  }

  // Update user in the database
  User.findByIdAndUpdate(userId, updateObject, { new: true })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(updatedUser)
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'Error updating user', error: error.message })
    })
}

exports.deleteUser = (req, res) => {
  const userId = req.params.userId

  // Delete user from the database
  User.findByIdAndDelete(userId)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(204).json() // No content (successful deletion)
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'Error deleting user', error: error.message })
    })
}

// Update apiPair fields by user ID and apiPair ID
exports.updateApiPair = (req, res) => {
  const userId = req.params.userId
  const apiPairId = req.params.apiPairId
  const { apiKey, apiSecret, label } = req.body

  // Validate if at least one field is provided
  if (!apiKey && !apiSecret && !label) {
    return res
      .status(400)
      .json({
        message:
          'At least one field (apiKey, apiSecret, or label) is required for update.'
      })
  }

  // Construct the update object based on the provided fields
  const updateObject = {}
  if (apiKey) {
    updateObject['apiPairs.$[apiPair].apiKey'] = apiKey
  }
  if (apiSecret) {
    updateObject['apiPairs.$[apiPair].apiSecret'] = apiSecret
  }
  if (label) {
    updateObject['apiPairs.$[apiPair].label'] = label
  }

  // Update user in the database
  User.findOneAndUpdate(
    { _id: userId, 'apiPairs._id': apiPairId },
    { $set: updateObject },
    { new: true, arrayFilters: [{ 'apiPair._id': apiPairId }] }
  )
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({ message: 'User or apiPair not found' })
      }
      res.status(200).json(updatedUser)
    })
    .catch(error => {
      res
        .status(500)
        .json({ message: 'Error updating apiPair', error: error.message })
    })
}

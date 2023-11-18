module.exports = mongoose => {
  var schema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    apiPairs: [
      {
        apiKey: {
          type: String,
          required: [true, 'API Key is required']
        },
        apiSecret: {
          type: String,
          required: [true, 'API Secret is required']
        },
        label: {
          type: String,
          required: [true, 'Label is required']
        }
      }
    ]
  })

  const User = mongoose.model('User', schema)

  return User
}

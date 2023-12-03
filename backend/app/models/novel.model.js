module.exports = mongoose => {
  var schema = mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Name is required']
    },
    synopsis: {
      type: String
    },
    chapters: [
      {
        name: {
          type: String,
          required: [true, 'Chapter name is required'],
          unique: true
        },
        content: {
          type: String,
          required: [true, 'Content chapter is required']
        }
      }
    ]
  })

  const Novel = mongoose.model('Novel', schema)

  return Novel
}

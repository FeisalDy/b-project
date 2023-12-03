const express = require('express')
const app = express()
const port = 3001
const db = require('./app/models')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

require('./app/routes/user.routes')(app)
require('./app/routes/account.routes')(app)
require('./app/routes/novel.routes')(app)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

db.mongoose
  .connect(db.url)
  .then(() => {
    console.log('Connected to the database!')
    app.listen(port, () => {
      console.log(`App listening on port ${port}`)
    })
  })
  .catch(err => {
    console.log('Something wrong', err)
    process.exit()
  })

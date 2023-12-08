const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'app/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })

module.exports = app => {
  const novel = require('../controllers/novel.controllers.js')

  var router = require('express').Router()

  router.get('/', novel.getAllNovels)
  router.get('/:novelId', novel.getNovel)
  router.get('/:novelId/chapters/:chapterIndex', novel.getChapter)
  router.get('/:novelId/chapters', novel.getAllChapters)
  router.post('/add', upload.single('file'), novel.addNovel)
  router.post('/addChapter/:novelId', upload.single('file'), novel.addChapter)

  app.use('/api/novel', router)
}

const db = require('../models')
const fs = require('fs')
const Novel = db.novel
const { BlobServiceClient } = require('@azure/storage-blob')

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
)
const containerClient = blobServiceClient.getContainerClient(
  process.env.CONTAINER_NAME
)
console.log('containerClient', containerClient)

// Create the container if it doesn't exist
async function createContainerIfNotExists () {
  try {
    const containerExists = await containerClient.exists()
    if (!containerExists) {
      await containerClient.create()
      console.log(`Container '${CONTAINER_NAME}' created.`)
    }
  } catch (error) {
    console.error('Error while creating container:', error)
    throw error
  }
}

// Call the function to create the container before uploading files

const uploadToAzure = async file => {
  createContainerIfNotExists()

  try {
    const blobName = `novelImages/${file.originalname}`
    const blockBlobClient = containerClient.getBlockBlobClient(blobName)

    // Read the file from the path and upload it
    const fileStream = fs.createReadStream(file.path)
    await blockBlobClient.uploadStream(fileStream, file.size)

    // Cleanup: Delete the temporary file after upload
    fs.unlinkSync(file.path)

    return blobName // Return the path or blob URL
  } catch (error) {
    console.error('Error while uploading to Azure:', error)
    throw error
  }
}

// Get all novels
exports.getAllNovels = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const includeChapters = req.query.projection === 'true'
    const projection = includeChapters ? {} : { chapters: 0 }

    const options = {
      limit: limit,
      skip: (page - 1) * limit,
      select: projection
    }

    const count = await Novel.countDocuments() // Get total count of items
    const novels = await Novel.find({}, {}, options)
    const totalPages = Math.ceil(count / limit)

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalItems: count
    }

    res.status(200).json({ novels, pagination })
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error retrieving novels' })
  }
}

// Get a single novel
exports.getNovel = async (req, res) => {
  try {
    const novelId = req.params.novelId
    const novel = await Novel.findById(novelId)

    if (!novel) {
      return res.status(404).send({ message: 'Novel not found' })
    }

    res.status(200).json(novel)
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error retrieving novel' })
  }
}

// Get all chapters of a novel with pagination
exports.getAllChapters = async (req, res) => {
  try {
    const novelId = req.params.novelId
    const page = parseInt(req.query.page) || 1 // Page number, default to 1
    const limit = parseInt(req.query.limit) || 1 // Number of items per page, default to 10

    const novel = await Novel.findById(novelId)

    if (!novel) {
      return res.status(404).send({ message: 'Novel not found' })
    }

    const count = novel.chapters.length
    const totalPages = Math.ceil(count / limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const chapters = novel.chapters.slice(startIndex, endIndex)

    const pagination = {
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      totalItems: count
    }

    res.status(200).json({ chapters, pagination })
  } catch (err) {
    res
      .status(500)
      .send({ message: err.message || 'Error retrieving chapters' })
  }
}

// Get a single chapter from a novel
exports.getChapter = async (req, res) => {
  try {
    const novelId = req.params.novelId
    const chapterIndex = parseInt(req.params.chapterIndex) - 1

    const novel = await Novel.findById(novelId)

    if (!novel) {
      return res.status(404).send({ message: 'Novel not found' })
    }

    // const chapter = novel.chapters.find(
    //   ch => ch.name.toLowerCase() === chapterName.toLowerCase()
    // )
    const chapter = novel.chapters[chapterIndex]

    if (!chapter) {
      return res.status(404).send({ message: 'Chapter not found' })
    }

    // const chapterIndex = novel.chapters.indexOf(chapter)

    const totalChapters = novel.chapters.length

    res.status(200).json({ chapter, chapterIndex, totalChapters })
  } catch (err) {
    res.status(500).send({ message: err.message || 'Error retrieving chapter' })
  }
}

// Add Novel
exports.addNovel = async (req, res) => {
  try {
    // if (!req.body.name || !req.body.synopsis) {
    //   return res
    //     .status(400)
    //     .send({ message: 'Name and synopsis are required!' })
    // }
    // if (!req.file) {
    //   return res.status(400).send({ message: 'Please upload a valid file' })
    // }

    let imagePath = ''

    if (req.file) {
      imagePath = await uploadToAzure(req.file)
    } else {
      return res.status(400).send({ message: 'Please upload a valid file' })
    }

    const novel = new Novel({
      image: imagePath,
      name: req.body.name,
      synopsis: req.body.synopsis,
      chapters: req.body.chapters || []
    })

    const newNovel = await novel.save()
    res
      .status(201)
      .send({ message: 'Novel created successfully', novel: newNovel })
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while creating the novel'
    })
  }
}

// Add Chapter from TXT File
exports.addChapter = async (req, res) => {
  try {
    const novelId = req.params.novelId
    const novel = await Novel.findById(novelId)

    if (!novel) {
      return res.status(404).send({ message: 'Novel not found' })
    }

    if (!req.file || !req.file.path) {
      return res.status(400).send({ message: 'Please upload a valid file' })
    }

    const filePath = req.file.path

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const lines = fileContent.split('\n')

    let start = 0
    let end = 100
    let chapters = []

    while (start < lines.length) {
      const chapterContent = lines.slice(start, end).join('\n\n')

      const newChapter = {
        name: `Section ${chapters.length + 1}`,
        content: chapterContent
      }

      chapters.push(newChapter)

      start = end
      end += 100
    }

    // Save chapters to the novel
    for (const chapter of chapters) {
      novel.chapters.push(chapter)
    }

    await novel.save()

    fs.unlinkSync(filePath) // Remove the uploaded file

    res.status(201).send({ message: 'Chapters uploaded successfully', novel })
  } catch (err) {
    res.status(500).send({
      message: err.message || 'Some error occurred while uploading chapters'
    })
  }
}

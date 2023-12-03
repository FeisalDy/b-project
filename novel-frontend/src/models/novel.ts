export type Novel = {
  _id: string
  name: string
  synopsis: string
  chapters?: {
    _id: string
    name: string
    content: string
  }[]
}

export type Chapter = {
  chapter: {
    name: string
    content: string
    _id: string
  }
  chapterIndex: number
  totalChapters: number
}

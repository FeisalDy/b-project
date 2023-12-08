import { Axios } from '@/lib/axios'
import { Novel } from '@/models/novel'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home () {
  const projection = 'false'
  const page = 1
  const limit = 10

  const response = await Axios.get('/', {
    params: { projection, page, limit }
  })

  const res: Novel[] = response.data.novels

  return (
    <div className='m-2'>
      <Card className='grid grid-cols-2 gap-4 border-none bg-none shadow-none'>
        {res.map(novel => (
          <Link key={novel._id} href={`/${novel._id}`}>
            <Card className='h-36 md:h-64'>
              <CardHeader className='p-2 md:px-6 truncate'>
                {novel.name}
              </CardHeader>
              <CardContent className='px-2 md:px-6'>
                {novel.image ? (
                  <Image
                    src={`${process.env.BLOB_URL}${novel.image}`}
                    alt={novel.name}
                    height={200}
                    width={150}
                  />
                ) : (
                  <Image
                    src='https://demofree.sirv.com/nope-not-here.jpg'
                    alt='Default'
                    height={200}
                    width={150}
                  />
                )}
                <CardDescription className='text-sm line-clamp-5 md:line-clamp-6'>
                  {novel.synopsis}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </Card>
    </div>
  )
}

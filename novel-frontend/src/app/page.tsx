import { Axios } from '@/lib/axios'
import { Novel } from '@/models/novel'
import { AspectRatio } from '@/components/ui/aspect-ratio'
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
    <div className='grid grid-cols-2 gap-4 my-4'>
      {res.map(novel => (
        <Link key={novel._id} href={`/${novel._id}`}>
          <div className='flex flex-row gap-2 hover:scale-105 transition-transform duration-300 ease-in-out'>
            <div className='basis-1/4 relative overflow-hidden'>
              <AspectRatio ratio={2 / 3}>
                <div className='group w-full h-full'>
                  {novel.image ? (
                    <Image
                      src={`${process.env.BLOB_URL}${novel.image}`}
                      alt={novel.name}
                      className='rounded-md object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out'
                      layout='fill'
                      fill
                    />
                  ) : (
                    <Image
                      src='https://demofree.sirv.com/nope-not-here.jpg'
                      alt='Default'
                      className='rounded-md object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out'
                      layout='fill'
                      fill
                    />
                  )}
                </div>
              </AspectRatio>
            </div>
            <div className='basis-3/4'>
              <div className='line-clamp-2 transition-all duration-300 ease-in-out group-hover:text-xl'>
                {novel.name}
              </div>
              <div className='line-clamp-4 text-sm transition-all duration-300 ease-in-out group-hover:text-lg'>
                {novel.synopsis}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

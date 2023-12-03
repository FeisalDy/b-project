import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Axios } from '@/lib/axios'
import { Novel } from '@/models/novel'
import Link from 'next/link'

export default async function Home ({ params }: { params: { id: string } }) {
  const response = await Axios.get(`/${params.id}`)

  const res: Novel = response.data

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{res.name}</CardTitle>
          <CardDescription>{res.synopsis}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className='grid grid-cols-3 md:grid-cols-4 gap-4'>
            {res.chapters?.map((chapter, index) => (
              <li
                key={index}
                className='cursor-pointer hover:bg-gray-300 text-center rounded-md md:p-2'
              >
                <Link href={`/${params.id}/${index + 1}`} passHref>
                  <p className='text-sm'>{chapter.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
        {/* <CardFooter className='flex justify-between'></CardFooter> */}
      </Card>
    </div>
  )
}

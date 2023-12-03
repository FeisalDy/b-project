import React from 'react'
import { Axios } from '@/lib/axios'
import { Chapter } from '@/models/novel'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon
} from '@radix-ui/react-icons'
import Link from 'next/link'

export default async function Home ({
  params
}: {
  params: { id: string; chapterIndex: number }
}) {
  const response = await Axios.get(
    `/${params.id}/chapters/${params.chapterIndex}`
  )

  const res: Chapter = response.data
  const index = res.chapterIndex
  const total = res.totalChapters
  console.log(total)
  console.log(index)

  const formattedContent = res.chapter.content
    .split('\n')
    .map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ))

  return (
    <div>
      <Card>
        <CardHeader className='text-center'>{res.chapter.name}</CardHeader>
        <CardContent>
          <CardDescription>{formattedContent}</CardDescription>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              disabled={index === 0}
            >
              <Link href={`/${params.id}/1`}>
                <span className='sr-only'>Go to first page</span>
                <DoubleArrowLeftIcon className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              disabled={index === 0}
            >
              <Link href={`/${params.id}/${index}`}>
                <span className='sr-only'>Go to previous page</span>
                <ChevronLeftIcon className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              disabled={index === total - 1}
            >
              <Link href={`/${params.id}/${index + 2}`}>
                <span className='sr-only'>Go to next page</span>
                <ChevronRightIcon className='h-4 w-4' />
              </Link>
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              disabled={index === total - 1}
            >
              <Link href={`/${params.id}/${total}`}>
                <span className='sr-only'>Go to last page</span>
                <DoubleArrowRightIcon className='h-4 w-4' />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

import { Card } from '@/components/ui/card'

export default function NovelLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return <Card className='max-w-screen-lg mx-auto'>{children}</Card>
}

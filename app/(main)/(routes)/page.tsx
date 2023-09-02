import { ModeToggle } from '@/components/mode-toggle'
import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      This is a protectted route
      <ModeToggle />
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      This is a protectted route
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}

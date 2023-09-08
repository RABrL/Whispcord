'use client'

import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { isMacOs } from '@/lib/utils'

interface ServerSearchProps {
  data: {
    label: string
    type: 'channel' | 'member'
    data:
      | {
          icon: React.ReactNode
          name: string
          id: string
        }[]
      | undefined
  }[]
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  let isMac
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    isMac = isMacOs()
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const onClick = ({
    id,
    type
  }: { id: string; type: 'channel' | 'member' }) => {
    setIsOpen(false)

    if (type === 'member') {
      return router.push(`/servers/${params?.serverId}/conversations/${id}`)
    }

    if (type === 'channel') {
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }
  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group px-2 py-2 rounded-md flex items-center gap-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        <SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
        <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
          Search
        </p>
        <kbd className="pointer-events-none flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
          <abbr title={isMac ? 'Command' : 'Control'}>
            {!isMac ? '⌘' : 'Ctrl+'}
          </abbr>
          K
        </kbd>
      </button>
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput placeholder="Search all channels and members" />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ data, type, label }) => {
            if (!data?.length) return null

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem onSelect={() => onClick({ id, type })} key={id}>
                    {icon}
                    <span className={icon ? 'ml-2' : undefined}>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

'use client'

import '@uploadthing/react/styles.css'

import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import axios from 'axios'

import { UploadDropzone } from '@/lib/uploadthing'

interface FileUploadProps {
  endpoint: 'serverImage' | 'messageFile'
  onChange: (url?: string) => void
  value: string
}

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
  const fileType = value?.split('.').pop()

  const onDeleteFile = async () => {
    try {
      await axios.delete('/api/uploadthing', {
        data: { file: value.split('/').pop() }
      })
      onChange('')
    } catch (error) {
      console.log(error)
    }
  }

  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          sizes="100px"
          className="rounded-full"
        />
        <button
          onClick={onDeleteFile}
          className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
        <button
          onClick={onDeleteFile}
          className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        console.log(error)
      }}
    />
  )
}

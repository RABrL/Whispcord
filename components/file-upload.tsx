'use client'

import '@uploadthing/react/styles.css'

import { X } from 'lucide-react'
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

  if (value && fileType !== 'pdf') {
    const onDeleteFile = async () => {
      const res = await axios.delete('/api/uploadthing', {
        data: { file: value.split('/').pop() }
      })
      onChange('')
    }

    return (
      <div className="relative h-20 w-20">
        <Image fill src={value} alt="Upload" className="rounded-full" />
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

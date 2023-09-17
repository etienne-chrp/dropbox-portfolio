import { AppConstants } from '@/utils/constants'
import { getTextFileOrErrorMsg } from '@/utils/dbx/api_client'
import { SharedLink } from '@/utils/dbx/common'
import ReactMarkdown from 'react-markdown'

export default async function Page() {
  const aboutMarkdown = await getTextFileOrErrorMsg(SharedLink, AppConstants.getAboutPath())

  return (
    <div className='w-1/2 m-auto'>
      <ReactMarkdown>{aboutMarkdown}</ReactMarkdown>
    </div>
  )
}
import ReactMarkdownPortfolio from '@/components/ReactMarkdownPortfolio'
import { AppConstants } from '@/utils/constants'
import { getTextFileOrErrorMsg } from '@/utils/dbx/api_client'
import { SharedLink } from '@/utils/dbx/common'
import ReactMarkdown from 'react-markdown'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const aboutMarkdown = await getTextFileOrErrorMsg(SharedLink, AppConstants.getAboutPath())

  return (
    <div className='sm:w-1/2 m-auto mt-6'>
      <ReactMarkdownPortfolio>{aboutMarkdown}</ReactMarkdownPortfolio>
    </div>
  )
}
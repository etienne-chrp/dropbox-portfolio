import ReactMarkdownPortfolio from '@/components/ReactMarkdownPortfolio'
import { AppConstants } from '@/utils/constants'
import { getTextFileOrErrorMsg } from '@/utils/dbx/api_client'
import { SharedLink } from '@/utils/dbx/common'
import ReactMarkdown from 'react-markdown'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const aboutMarkdown = await getTextFileOrErrorMsg(SharedLink, AppConstants.getAboutPath())

  return (
    <div className='w-1/2 m-auto'>
      <ReactMarkdownPortfolio>{aboutMarkdown}</ReactMarkdownPortfolio>
    </div>
  )
}
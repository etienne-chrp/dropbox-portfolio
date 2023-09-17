export const dbxRefreshToken = process.env.DBX_REFRESH_TOKEN
export const dbxClientId = process.env.DBX_CLIENT_ID
export const dbxClientSecret = process.env.DBX_CLIENT_SECRET
export const dbxSharedLinkId = process.env.DBX_SHAREDLINK_ID
export const dbxSharedLinkKey = process.env.DBX_SHAREDLINK_KEY

export const SharedLink = getSharedLinkWithPath('')
export function getSharedLinkWithPath(path: string): string {
  return `https://www.dropbox.com/sh/${dbxSharedLinkId}/${dbxSharedLinkKey}${path}`
}

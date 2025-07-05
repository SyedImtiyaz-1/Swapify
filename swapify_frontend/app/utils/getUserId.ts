import { headers } from 'next/headers'

export const getUserId = async () => {
  const headersList = await headers()
  const userId = headersList.get('x-user-id')
  return userId
}

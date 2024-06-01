import { ROUTE } from '@/constants'

export const authRoutes = [ROUTE.USER_LOGIN, ROUTE.ADMIN_LOGIN]
export const adminRoutes = [ROUTE.MANAGE_USER, ROUTE.MANAGE_BUSINESS]
export const userRoutes = [ROUTE.ABOUT]

export const checkValidRoutes = (presentPath: string): boolean => {
  if (adminRoutes.includes(presentPath) || userRoutes.includes(presentPath)) {
    return true
  }
  return false
}

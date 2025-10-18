import { getAdminUser } from '@/lib/auth'
import { LogoutButton } from './LogoutButton'

export async function AdminHeader() {
  const adminUser = await getAdminUser()

  if (!adminUser) {
    return null
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Services Admin
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {adminUser.full_name || adminUser.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {adminUser.role.replace('_', ' ')}
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}

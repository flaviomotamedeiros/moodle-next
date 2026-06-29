import { Sidebar } from '@/components/app-shell/sidebar'
import { Topbar } from '@/components/app-shell/topbar'
import { CURRENT_USER } from '@/lib/mock-data'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar userName={CURRENT_USER.name} />
        <main className="flex-1 px-6 py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  )
}

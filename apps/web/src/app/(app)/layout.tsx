import { Sidebar } from '@/components/app-shell/sidebar'
import { Topbar } from '@/components/app-shell/topbar'
import { AuthGuard } from '@/components/auth/auth-guard'
import { SidebarProvider } from '@/components/app-shell/sidebar-context'
import { ContentContainer } from '@/components/app-shell/content-container'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-6 py-8">
              <ContentContainer>{children}</ContentContainer>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}

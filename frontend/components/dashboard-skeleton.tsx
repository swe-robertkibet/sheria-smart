import { Card } from "antd"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#FEFCF3]">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-[#E2E8F0] px-4 py-4">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar Skeleton */}
        <div className="w-80 bg-white border-r border-[#E2E8F0] p-4">
          <div className="space-y-3">
            <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-full h-8 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Welcome Message Skeleton */}
            <Card className="border-[#E2E8F0]">
              <div className="space-y-3">
                <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-100 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-100 rounded animate-pulse"></div>
              </div>
            </Card>

            {/* Feature Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-[#E2E8F0] h-32">
                  <div className="space-y-3">
                    <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-full h-4 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
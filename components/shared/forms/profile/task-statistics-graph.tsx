import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskStatisticsGraphProps {
  userId: string
}

export default function TaskStatisticsGraph({ userId }: TaskStatisticsGraphProps) {
  // In a real application, you would fetch the task statistics data here
  // For this example, we'll use placeholder data
  const completionRate = 75

  return (
    <Card className="bg-gray-700 border-gray-600">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-400">Task Completion Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4B5563"
                strokeWidth="3"
              />
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeDasharray={`${completionRate}, 100`}
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-green-400">
              {completionRate}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


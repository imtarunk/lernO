"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Award, Crown, Gift } from "lucide-react"

export function LearningRewards() {
  const currentPoints = 1340
  const nextReward = 1500
  const progress = (currentPoints / nextReward) * 100

  const rewards = [
    { icon: Trophy, name: "Quiz Master Badge", type: "badge", claimable: true },
    { icon: Award, name: "100 Bonus Points", type: "points", claimable: true },
    { icon: Crown, name: "Premium Access (1 week)", type: "premium", claimable: true },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-600">
          <Trophy size={20} />
          <span>Learning Rewards</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{currentPoints.toLocaleString()}</div>
          <div className="text-sm text-gray-500">Points Earned</div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Next Reward:</span>
              <span>{nextReward} pts</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
            <Gift size={16} className="mr-2" />
            Claim Rewards
          </Button>
        </div>

        <div>
          <h4 className="font-semibold mb-3 flex items-center space-x-2">
            <Gift size={16} />
            <span>Available Rewards</span>
          </h4>

          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <reward.icon size={20} className="text-green-600" />
                  <span className="text-sm font-medium">{reward.name}</span>
                </div>
                <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                  Claim
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Crown, Gift } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect } from "react";

declare global {
  interface Window {
    webln: {
      enable: () => Promise<void>;
      makeInvoice: (args: {
        amount: number;
        defaultMemo: string;
      }) => Promise<{ paymentRequest: string }>;
    };
  }
}

export function LearningRewards() {
  const currentPoints = 1340;
  const nextReward = 1500;
  const progress = (currentPoints / nextReward) * 100;

  const rewards = [
    {
      icon: Trophy,
      name: "Quiz Master Badge",
      type: "badge",
      claimable: true,
    },
    {
      icon: Award,
      name: "100 Bonus Points",
      type: "points",
      claimable: true,
    },
    {
      icon: Crown,
      name: "Premium Access (1 week)",
      type: "premium",
      claimable: true,
    },
  ];

  const AlbyButton = dynamic(
    () => import("@getalby/bitcoin-connect-react").then((mod) => mod.Button),
    { ssr: false }
  );

  useEffect(() => {
    const loadProvider = async () => {
      const { onConnected } = await import("@getalby/bitcoin-connect-react");
      const unsub = onConnected((provider) => {
        window.webln = provider;
      });

      return () => unsub();
    };

    loadProvider();
  }, []);

  return (
    <Card className="max-w-md mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-600">
          <Trophy size={20} />
          <span>Learning Rewards</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Points Progress */}
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">
            {currentPoints.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">Points Earned</div>

          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2 text-gray-600">
              <span>Next Reward:</span>
              <span>{nextReward} pts</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200" />
          </div>

          <div className="mt-5">
            <AlbyButton />
          </div>
        </div>

        {/* Rewards */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center space-x-2 text-gray-700">
            <Gift size={16} />
            <span>Available Rewards</span>
          </h4>

          <div className="space-y-3">
            {rewards.map((reward, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-emerald-50 transition"
              >
                <div className="flex items-center space-x-3 text-sm text-gray-800">
                  <reward.icon size={20} className="text-green-600" />
                  <span className="font-medium">{reward.name}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-100 hover:text-green-700"
                >
                  Claim
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

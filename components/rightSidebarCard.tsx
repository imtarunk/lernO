import { LearningRewards } from "./learning-rewards";
import { UserSuggestions } from "./user-suggestions";

export default function RightSidebarCard() {
  return (
    <div className="lg:col-span-1 fixed right-16 top-20">
      <LearningRewards />

      {/* <Card className="mt-6">
  <CardContent className="p-4">
    <div className="flex items-center space-x-2 text-blue-600 mb-2">
      <Target size={16} />
      <span className="font-medium">
        Keep your learning streak going!
      </span>
    </div>
  </CardContent>
</Card> */}

      {/* Add UserSuggestions component */}
      <div className="mt-6">
        <UserSuggestions />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "C++",
  "SQL",
  "MongoDB",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "UI/UX Design",
  "Product Management",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Computing",
];

interface SkillsDrawerProps {
  userId: string;
  currentSkills: string[];
  onSkillsUpdate: (skills: string[]) => void;
}

export function SkillsDrawer({
  userId,
  currentSkills,
  onSkillsUpdate,
}: SkillsDrawerProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentSkills);
  const { toast } = useToast();

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/skills`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: selectedSkills }),
      });

      if (!response.ok) {
        throw new Error("Failed to update skills");
      }

      onSkillsUpdate(selectedSkills);
      toast({
        title: "Success!",
        description: "Your skills have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skills. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full">
          Manage Skills
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Manage Your Skills</DrawerTitle>
            <DrawerDescription>
              Select the skills you want to showcase on your profile.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[400px] px-4">
            <div className="flex flex-wrap gap-2 p-4">
              {DEFAULT_SKILLS.map((skill) => (
                <Badge
                  key={skill}
                  variant={
                    selectedSkills.includes(skill) ? "default" : "outline"
                  }
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </ScrollArea>
          <DrawerFooter>
            <Button onClick={handleSave}>Save Changes</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

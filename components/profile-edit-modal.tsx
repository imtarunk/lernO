"use client";

import { useState } from "react";
import { useRecoilState } from "recoil";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, useUserContext } from "./user-context";

interface ProfileEditModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileEditModal({
  open,
  onClose,
}: ProfileEditModalProps) {
  const { profile, setProfile } = useUserContext();
  const [name, setName] = useState(profile?.name || "");
  const [image, setImage] = useState(profile?.image || "");
  const [bio, setBio] = useState((profile as any)?.bio || "");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const res = await fetch(`/api/user/${profile?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image, bio }),
    });
    if (res.ok) {
      const updated: User = await res.json();
      setProfile(updated);
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={image || undefined} alt={name || "User"} />
              <AvatarFallback>{name ? name[0] : "U"}</AvatarFallback>
            </Avatar>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

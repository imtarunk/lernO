"use client";

import { useState, useRef } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CoverImageUploadProps {
  userId: string;
  currentCoverImage: string | null;
  onCoverImageUpdate: (imageUrl: string) => void;
}

export function CoverImageUpload({
  userId,
  currentCoverImage,
  onCoverImageUpdate,
}: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 100,
    height: 30,
    x: 0,
    y: 0,
  });
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async (image: HTMLImageElement, crop: Crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error("Canvas is empty");
          }
          resolve(blob);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  const handleCropComplete = async () => {
    if (!imageRef.current || !imageSrc) return;

    try {
      setIsUploading(true);
      const croppedImage = await getCroppedImg(imageRef.current, crop);
      const formData = new FormData();
      formData.append("file", croppedImage, "cover.jpg");

      const response = await fetch("/api/upload/cover", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload cover image");
      }

      const data = await response.json();
      onCoverImageUpdate(data.coverImage);
      setShowCrop(false);
      setImageSrc(null);
      toast({
        title: "Success!",
        description: "Cover image updated successfully",
      });
    } catch (error) {
      console.error("Error uploading cover image:", error);
      toast({
        title: "Error",
        description: "Failed to upload cover image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative">
      <div
        className="w-full h-48 bg-cover bg-center rounded-lg relative group"
        style={{
          backgroundImage: currentCoverImage
            ? `url(${currentCoverImage})`
            : "linear-gradient(to right, #4f46e5, #7c3aed)",
        }}
      >
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <label
            htmlFor="cover-upload"
            className="cursor-pointer bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
          >
            <Camera className="w-5 h-5 text-white" />
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {showCrop && imageSrc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-4 w-full max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Crop Cover Image</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCrop(false);
                  setImageSrc(null);
                }}
              >
                Cancel
              </Button>
            </div>
            <div className="relative max-h-[50vh] overflow-auto rounded-lg border border-gray-200">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={16 / 9}
                className="max-w-full"
              >
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Cover preview"
                  className="max-w-full"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCrop(false);
                  setImageSrc(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCropComplete} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

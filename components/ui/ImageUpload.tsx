'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Button from './Button';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  currentImage?: string;
  multiple?: boolean;
  images?: string[];
  onRemove?: (index: number) => void;
}

export default function ImageUpload({ onUpload, currentImage, multiple, images, onRemove }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    // YOUR CREDENTIALS - REPLACE 'riverside_uploads' WITH YOUR NEW PRESET NAME
    const cloudName = 'dkcnwjvn0';
    const uploadPreset = 'riverside_uploads'; // <-- USE THE NEW PRESET NAME YOU CREATED

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // This will now show the specific error from Cloudinary
        throw new Error(data.error?.message || 'Upload failed');
      }

      onUpload(data.secure_url);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-gray-100">
          <Image
            src={currentImage}
            alt="Current package image"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
      />

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <>
            <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
            Uploading...
          </>
        ) : currentImage ? (
          'Change Image'
        ) : (
          'Upload Image'
        )}
      </Button>

      <p className="text-xs text-gray-500">
        Supports JPG, PNG, GIF. Max 5MB.
      </p>
    </div>
  );
}
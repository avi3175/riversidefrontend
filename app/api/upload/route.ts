import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    console.log('Cloud Name:', cloudName);
    console.log('Upload Preset:', uploadPreset);

    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: 'Cloudinary not configured' }, { status: 500 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create form data for Cloudinary using buffer
    const cloudinaryFormData = new FormData();
    const blob = new Blob([buffer], { type: file.type });
    cloudinaryFormData.append('file', blob, file.name);
    cloudinaryFormData.append('upload_preset', uploadPreset);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    console.log('Upload URL:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    const responseText = await response.text();
    console.log('Cloudinary Status:', response.status);
    console.log('Cloudinary Response:', responseText);

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.error?.message || errorData.message || responseText;
      } catch (e) {
        errorMessage = responseText;
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid response from Cloudinary' }, { status: 500 });
    }

    return NextResponse.json({ secure_url: data.secure_url });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
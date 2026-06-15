import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { publicId } = body;

    console.log('Received delete request for publicId:', publicId);

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    console.log('Cloud Name exists:', !!cloudName);
    console.log('API Key exists:', !!apiKey);
    console.log('API Secret exists:', !!apiSecret);

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
    }

    // Create Basic Auth header
    const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // Call Cloudinary API directly
    const formData = new FormData();
    formData.append('public_id', publicId);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;
    console.log('Calling Cloudinary URL:', uploadUrl);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
      body: formData,
    });

    const responseText = await response.text();
    console.log('Cloudinary response status:', response.status);
    console.log('Cloudinary response body:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Cloudinary response:', responseText);
      return NextResponse.json({ error: 'Invalid response from Cloudinary' }, { status: 500 });
    }

    if (data.result === 'ok') {
      return NextResponse.json({ success: true, message: 'Image deleted successfully' });
    } else {
      return NextResponse.json({ error: data.error?.message || 'Failed to delete image' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error in delete API:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
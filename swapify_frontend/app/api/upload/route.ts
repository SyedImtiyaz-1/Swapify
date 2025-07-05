import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files'); // Get all files from the 'files' field
    
    const uploadFormData = new FormData();
    files.forEach((file) => {
      uploadFormData.append('files', file); // Append each file to the new FormData
    });

    // Forward the request to the media CDN
    const response = await fetch(`${process.env.MEDIACDN}/upload`, {
      method: 'POST',
      body: uploadFormData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { file, type, name } = await request.json();

    // Validate request
    if (!file || !type || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(join(uploadsDir, 'dummy'), '');
    } catch (error) {
      // Directory doesn't exist, create it
      await writeFile(join(uploadsDir, 'dummy'), '');
    }

    // Generate unique filename
    const extension = name.split('.').pop();
    const filename = `${uuidv4()}.${extension}`;
    const filepath = join(uploadsDir, filename);

    // Write file
    const base64Data = file.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    await writeFile(filepath, buffer);

    // Return file URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { Letter } from '@/hooks/use-letters';

interface LettersData {
  letters: Letter[];
}

const STORE_ID = process.env.BLOB_READ_WRITE_TOKEN;

// Helper function to get the latest letters blob
async function getLatestLettersBlob() {
  try {
    const result = await list({ prefix: 'letters_' });
    if (!result?.blobs?.length) {
      console.log('No blobs found in storage');
      return null;
    }
    
    // Sort by uploadedAt in descending order to get the most recent
    const blobs = result.blobs.sort((a, b) => 
      new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    return blobs[0];
  } catch (error) {
    console.error('Error listing blobs:', error);
    return null;
  }
}

// This is a simple API route that handles both GET and POST requests
export async function GET() {
  try {
    console.log('Fetching letters...');
    const lettersBlob = await getLatestLettersBlob();
    
    if (!lettersBlob?.url) {
      console.log('No letters blob found');
      return NextResponse.json({ letters: [] });
    }

    console.log('Fetching from URL:', lettersBlob.url);
    const response = await fetch(lettersBlob.url);
    
    if (!response.ok) {
      console.error('Blob fetch failed:', response.status, response.statusText);
      return NextResponse.json({ letters: [] }, { status: 500 });
    }

    const text = await response.text();
    console.log('Received response:', text.substring(0, 200));
    
    const data = JSON.parse(text) as LettersData;
    if (!data || !Array.isArray(data.letters)) {
      console.error('Invalid data structure received');
      return NextResponse.json({ letters: [] }, { status: 500 });
    }
    
    console.log('Successfully parsed data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load letters:', error);
    return NextResponse.json({ letters: [] }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const authKey = searchParams.get('key');
    
    // Verify Santa's key (this should match the key in your use-auth.ts)
    if (!process.env.SANTA_KEY || authKey !== process.env.SANTA_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the current letters
    const lettersBlob = await getLatestLettersBlob();
    if (!lettersBlob?.url) {
      return NextResponse.json({ error: 'No letters found' }, { status: 404 });
    }

    const response = await fetch(lettersBlob.url);
    const data = await response.json() as LettersData;

    // Find and remove the letter
    const letterIndex = data.letters.findIndex((letter) => letter.id === id);
    if (letterIndex === -1) {
      return NextResponse.json({ error: 'Letter not found' }, { status: 404 });
    }

    // Remove the letter
    data.letters.splice(letterIndex, 1);

    // Save the updated letters
    const timestamp = Date.now();
    await put(`letters_${timestamp}.json`, JSON.stringify(data), {
      access: 'public',
      contentType: 'application/json',
      token: STORE_ID
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete letter:', error);
    return NextResponse.json({ error: 'Failed to delete letter' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { letter } = await request.json();
    
    if (!letter || !letter.title || !letter.content || !letter.date) {
      return NextResponse.json({ 
        error: 'Invalid letter data',
        details: 'Missing required fields'
      }, { status: 400 });
    }

    try {
      // Get current letters
      const lettersBlob = await getLatestLettersBlob();
      let data: LettersData = { letters: [] };
      
      if (lettersBlob?.url) {
        const response = await fetch(lettersBlob.url);
        data = await response.json() as LettersData;
      }
      
      const newLetter: Letter = {
        ...letter,
        id: crypto.randomUUID(),
        createdAt: Date.now()
      };
      console.log('New letter:', newLetter);
      
      data.letters = [newLetter, ...data.letters];
      console.log('Saving updated data');
      
      const timestamp = Date.now();
      const putResult = await put(`letters_${timestamp}.json`, JSON.stringify(data), {
        access: 'public',
        contentType: 'application/json',
        token: STORE_ID
      });
      console.log('Put result:', putResult);
      
      return NextResponse.json({ success: true, letter: newLetter });
    } catch (blobError: any) {
      console.error('Blob operation failed:', blobError);
      return NextResponse.json({ 
        error: 'Failed to save letter',
        details: blobError.message || 'Unknown blob error'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Request processing failed:', error);
    return NextResponse.json({ 
      error: 'Failed to save letter',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

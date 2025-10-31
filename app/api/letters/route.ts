import { NextResponse } from 'next/server';
import { put, list } from '@vercel/blob';
import { Letter } from '@/hooks/use-letters';

const STORE_ID = process.env.BLOB_READ_WRITE_TOKEN;

// Helper function to get the latest letters blob
async function getLatestLettersBlob() {
  const result = await list({ prefix: 'letters_' });
  // Sort by uploadedAt in descending order to get the most recent
  const blobs = result.blobs.sort((a, b) => 
    new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
  );
  return blobs[0];
}

// This is a simple API route that handles both GET and POST requests
export async function GET() {
  try {
    console.log('Fetching letters...');
    const lettersBlob = await getLatestLettersBlob();
    console.log('Found blob:', lettersBlob);
    
    if (!lettersBlob?.url) {
      console.log('No letters blob found');
      return NextResponse.json({ letters: [] });
    }

    console.log('Fetching from URL:', lettersBlob.url);
    const response = await fetch(lettersBlob.url);
    const data = await response.json();
    console.log('Fetched data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to load letters:', error);
    return NextResponse.json({ error: 'Failed to load letters' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const authKey = searchParams.get('key');
    
    // Verify Santa's key (this should match the key in your use-auth.ts)
    if (authKey !== 'hohoho123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!id) {
      return NextResponse.json({ error: 'Letter ID is required' }, { status: 400 });
    }
    
    const lettersBlob = await getLatestLettersBlob();
    
    let data: { letters: Letter[] } = { letters: [] };
    if (lettersBlob?.url) {
      const response = await fetch(lettersBlob.url);
      data = await response.json();
    }

    data.letters = data.letters.filter(letter => letter.id !== id);
    
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
    console.log('Starting POST request');
    const body = await request.json();
    console.log('Received body:', body);
    
    if (!body.letter) {
      console.error('No letter in request body');
      return NextResponse.json({ error: 'No letter provided' }, { status: 400 });
    }
    
    const { letter } = body;
    console.log('Checking for existing letters');
    
    try {
      const lettersBlob = await getLatestLettersBlob();
      
      let data: { letters: Letter[] } = { letters: [] };
      if (lettersBlob?.url) {
        const response = await fetch(lettersBlob.url);
        data = await response.json();
        console.log('Existing data:', data);
      }
      
      const newLetter = {
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

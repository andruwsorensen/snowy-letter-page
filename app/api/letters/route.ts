import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { Letter } from '@/hooks/use-letters';

// This is a simple API route that handles both GET and POST requests
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'letters.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data);
  } catch (error) {
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

    const filePath = path.join(process.cwd(), 'public', 'letters.json');
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    // Filter out the letter to delete
    data.letters = data.letters.filter((letter: any) => letter.id !== id);

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete letter' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'letters.json');
    const { letter } = await request.json();
    
    // Read existing letters
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Add new letter
    const newLetter = {
      ...letter,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    data.letters = [newLetter, ...data.letters];
    
    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true, letter: newLetter });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save letter' }, { status: 500 });
  }
}

import { initDB } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await initDB();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 
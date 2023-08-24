import { NextResponse } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';

const dataPath = path.join(process.cwd(), 'public/mocks/brands.json');

export async function GET() {
  try {
    const sets = await fsPromises.readFile(dataPath, 'utf-8');
    const data = JSON.parse(sets);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(JSON.stringify({ message: 'no data available' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
}

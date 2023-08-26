import { NextResponse, NextRequest } from 'next/server';
import fsPromises from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { ISets } from '@/types';

const dataPath = path.join(process.cwd(), 'public/mocks/sets.json');

export async function GET(req: NextRequest) {
  try {
    const sets = await fsPromises.readFile(dataPath, 'utf-8');
    let data: ISets[] = JSON.parse(sets);
    const queryParams = new URLSearchParams(req.nextUrl.search);
    const sort = queryParams.get('sort');
    const category = queryParams.get('category');
    const brand = queryParams.get('brand');
    if (!category && !brand) {
      throw new Error('no category found');
    }
    if (category?.toLowerCase() !== 'all') {
      data = data.filter(
        (item) => item.category.toLowerCase() === category?.toLocaleLowerCase()
      );
    }
    if (brand?.toLowerCase() !== 'all') {
      data = data.filter(
        (item) => item.brand.toLowerCase() === brand?.toLocaleLowerCase()
      );
    }
    if (sort) {
      sort === 'created_at'
        ? data.sort((a, b) => a.created_at.localeCompare(b.created_at))
        : sort === 'name'
        ? data.sort((a, b) => a.name.localeCompare(b.name))
        : data;
    }
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(JSON.stringify({ message: 'no data available' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sets = await fsPromises.readFile(dataPath, 'utf-8');
    const data = JSON.parse(sets);

    const { name, category, address, type, brand } = await req.json();

    const id = crypto.randomBytes(16).toString('hex');
    const date = new Date();

    data.push({
      id,
      name,
      category,
      address,
      brand,
      type: type === 1 ? 'active' : 'archived',
      created_at: date.toISOString(),
    });

    const updatedData = JSON.stringify(data);

    await fsPromises.writeFile(dataPath, updatedData);

    return new NextResponse(
      JSON.stringify({ message: 'data added successfully!' }),
      { status: 201, headers: { 'content-type': 'application/json' } }
    );
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: 'Error reading or parsing the JSON file!' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

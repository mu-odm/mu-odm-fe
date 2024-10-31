
import { NextResponse } from 'next/server';

let sharedData = 'Initial Data';

export async function GET() {
  return NextResponse.json({ data: sharedData });
}

export async function POST(request: Request) {
  const { newData } = await request.json();
  sharedData = newData;
  return NextResponse.json({ data: sharedData });
}

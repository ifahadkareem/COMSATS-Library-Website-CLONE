import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Junaid Zaidi Library API',
    version: '1.0.0',
    institution: 'COMSATS University Islamabad',
  });
}

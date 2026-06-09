import { NextResponse } from 'next/server';
import provincesData from '../../../../../public/data/province.json';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: provincesData,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch provinces' },
      { status: 500 }
    );
  }
}


import { NextResponse } from 'next/server';
import districtsData from '../../../../../public/data/district.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('province_id');

    if (!provinceId) {
      return NextResponse.json(
        { success: false, error: 'province_id parameter is required' },
        { status: 400 }
      );
    }

    const id = Number(provinceId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'province_id must be a number' },
        { status: 400 }
      );
    }

    const filteredDistricts = districtsData.filter(
      (district: any) => district.province_id === id
    );

    return NextResponse.json({
      success: true,
      data: filteredDistricts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch districts' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import subDistrictsData from '../../../../../public/data/sub_district.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('district_id');

    if (!districtId) {
      return NextResponse.json(
        { success: false, error: 'district_id parameter is required' },
        { status: 400 }
      );
    }

    const id = Number(districtId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'district_id must be a number' },
        { status: 400 }
      );
    }

    const filteredSubDistricts = subDistrictsData.filter(
      (subDistrict: any) => subDistrict.district_id === id
    );

    return NextResponse.json({
      success: true,
      data: filteredSubDistricts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch sub-districts' },
      { status: 500 }
    );
  }
}

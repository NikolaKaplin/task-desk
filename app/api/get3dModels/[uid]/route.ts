import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;
  const url = `https://webapp.engineeringlumalabs.com/api/v3/creations/uuid/${uid}`;
  const options = {
    method: "GET",
  };
  const response = await fetch(url, options);
  const data = await response.json();
  return NextResponse.json(data);
}

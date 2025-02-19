import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const url = `https://webapp.engineeringlumalabs.com/api/v3/creations/uuid/${uid}`;
    console.log(`Fetching data for UID: ${uid}`);
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json();
    console.log(`Received data:`, data);
    return NextResponse.json(data);
  } catch (err) {
    const { uid } = await params;
    const url = `https://webapp.engineeringlumalabs.com/api/v3/creations/uuid/${uid}`;
    console.log(`Fetching data for UID: ${uid}`);
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
    const data = await response.json();
    console.log(`Received data:`, data);
    return NextResponse.json(data);
  }
}

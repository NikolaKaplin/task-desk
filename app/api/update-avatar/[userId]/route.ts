import { setUserAvatar } from "@/app/actions";
import { s3 } from "@/utils/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!req.headers.get("Content-Type")?.startsWith("image"))
    return new NextResponse(null, { status: 400 });
  const { userId } = await params;
  const Body = Buffer.from(await req.arrayBuffer());
  const Key = `avatar/${userId}/${Date.now()}.png`;

  if (Body.byteLength > 5 * 1024 * 1024)
    return new NextResponse(null, { status: 400 });

  await s3.send(
    new PutObjectCommand({
      Bucket: "altergemu-team",
      Key,
      Body,
    })
  );

  const url = `https://altergemu-team.storage.yandexcloud.net/${Key}`;
  let response = await setUserAvatar(userId, url);
  return NextResponse.json({ url });
}

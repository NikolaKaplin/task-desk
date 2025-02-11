import { setUserAvatar } from "@/app/actions";
import { s3 } from "@/utils/aws";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  if (!req.headers.get("Content-Type")?.startsWith("video"))
    return new NextResponse(null, { status: 400 });
  const { postId } = await params;
  const Body = Buffer.from(await req.arrayBuffer());
  const Key = `post/${postId}/${req}.mp4`;
  console.log("Start sending ==>");
  await s3.send(
    new PutObjectCommand({
      Bucket: "altergemu-team",
      Key,
      Body,
    })
  );

  const url = `https://altergemu-team.storage.yandexcloud.net/${Key}`;
  return NextResponse.json({ url });
}

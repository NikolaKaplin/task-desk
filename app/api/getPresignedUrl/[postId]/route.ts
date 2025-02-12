import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";

const s3Client = new S3Client({
  region: "ru-central1",
  endpoint: "https://storage.yandexcloud.net",
  credentials: {
    accessKeyId: "YCAJEyh-o4mLyiDs4JwVFsphF",
    secretAccessKey: "YCPKZiDTXj6VJ6NSkoQ8fKRN4gAlDj5FVbhUx7k1",
  },
});
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    const { filename, contentType } = await req.json();
    let key = `post/${postId}/${filename}`;

    console.log(`Generating presigned URL for ${key}`);

    const putObjectCommand = new PutObjectCommand({
      Bucket: "altergemu-team",
      Key: key,
      ContentType: contentType,
    });

    const presignedUrl = await getSignedUrl(s3Client, putObjectCommand, {
      expiresIn: 3600,
    });

    key = "https://storage.yandexcloud.net/altergemu-team/" + key;
    return NextResponse.json({ presignedUrl, key });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URL", details: error.message },
      { status: 500 }
    );
  }
}

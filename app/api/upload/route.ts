import { NextRequest, NextResponse } from "next/server";
import formidable, { IncomingForm } from "formidable";
import * as AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({
  accessKeyId: "YCAJEyh-o4mLyiDs4JwVFsphF", // Ваш Access Key ID
  secretAccessKey: "YCPKZiDTXj6VJ6NSkoQ8fKRN4gAlDj5FVbhUx7k1", // Ваш Secret Access Key
  region: "ru-central1", // Регион вашего S3
  endpoint: "https://storage.yandexcloud.net", // Если используете Yandex
});

const s3 = new AWS.S3();

export const config = {
  api: {
    bodyParser: false, // Отключите встроенный парсер Next.js
  },
};

const uploadFileToS3 = async (file: formidable.File) => {
  const fileStream = fs.createReadStream(file.filepath);
  const uploadParams = {
    Bucket: "altergemu-team",
    Key: "papashi.avi",
    Body: fileStream,
    ContentType: file.mimetype,
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export async function POST(req: NextRequest) {
  const form = formidable({
    multiples: false,
    keepExtensions: true,
  });

  return new Promise<NextResponse>((resolve, reject) => {
    // Получаем поток из тела запроса
    const stream = req.body;

    // Теперь парсим форму
    form.parse(stream as any, async (err, fields, files) => {
      if (err) {
        console.error("Ошибка при обработке формы:", err);
        return reject(
          new NextResponse("Ошибка при загрузке файла.", { status: 500 })
        );
      }

      const file = files.file[0];

      try {
        const data = await uploadFileToS3(file);
        resolve(
          new NextResponse(
            JSON.stringify({
              message: "Файл успешно загружен",
              url: data.Location,
            }),
            { status: 200 }
          )
        );
      } catch (error) {
        console.error("Ошибка при загрузке файла в S3:", error);
        reject(
          new NextResponse("Ошибка при загрузке файла в S3.", { status: 500 })
        );
      }
    });
  });
}

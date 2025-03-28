import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, model } = await req.json();
  console.log(text, model);
  const url = "https://hand.ni-li.com/api/llm-on-lpacpu/generate";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + process.env.HAND_AI_TOKEN,
    },
    body: `{"model":"${model}","prompt": ${JSON.stringify(text)}}`,
  };
  try {
    const response = await fetch(url, options);
    console.log(response);
    let data = (await response.json()).choices[0].message.content;
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json("Модели временно не доступны");
  }
}

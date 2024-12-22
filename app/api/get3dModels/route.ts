import { prisma } from "@/prisma/prisma-client";
import { NextRequest } from "next/server";

async function getNewToken() {
  let token = await prisma.thirdPartyTokens.findFirst({
    where: {
      service: "lumalabs-genie",
    },
  });
  const url = "https://webapp.engineeringlumalabs.com/api/v2/auth/refresh";
  const options = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken: token?.refreshToken }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    await prisma.thirdPartyTokens.update({
      where: {
        id: token?.id,
        service: "lumalabs-genie",
      },
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    });
    console.log(data);
    return data.accessToken;
  } catch (error) {
    console.error(error);
    return token?.accessToken;
  }
}

export async function POST(req: Request) {
  const { prompt } = await req.json();
  let seed = ~~(Math.random() * 10 ** 9);
  const token = await getNewToken();
  const urlUids = "https://webapp.engineeringlumalabs.com/api/v3/creations";
  const optionsUids = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: `{"input":{"text":"${prompt}","type":"imagine_3d_one","jobParams":{"seed":"${seed}"}},"client":"web"}`,
  };

  return await fetch(urlUids, optionsUids);
}

export async function GET(req: NextRequest) {
  const dataUid = await req.nextUrl.searchParams.get("uid");
  const url = `https://webapp.engineeringlumalabs.com/api/v3/creations/uuid/${dataUid}`;
  const options = {
    method: "GET",
  };
  return await fetch(url, options);
}

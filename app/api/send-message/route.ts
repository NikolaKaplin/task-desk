import { NextResponse } from "next/server"
import bot, { sendApplication } from "../../../bot"



export async function POST(req: Request) {
    const { message } = await req.json()
    const res = await sendApplication(message)
    return NextResponse.json({res})
}


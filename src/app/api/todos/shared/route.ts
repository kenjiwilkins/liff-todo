import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { findToDoListBySharedUserId } from "@/lib/data";

export async function GET(req: NextRequest) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
  const result = await axios.get(`https://api.line.me/oauth2/v2.1/userinfo`, {
    headers: {
      Authorization: `Bearer ${liffAccessToken}`,
    },
  });
  if (result.status !== 200) {
    return NextResponse.json(
      {
        message: `Unauthorized: ${result.statusText}`,
      },
      { status: 401 },
    );
  } else {
    try {
      const todos = await findToDoListBySharedUserId(result.data.sub);
      return NextResponse.json(
        {
          todos,
        },
        {
          status: 200,
        },
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to get todos: ${error}`,
        },
        {
          status: 500,
        },
      );
    }
  }
}

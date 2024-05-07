import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { addShared, getShared, addSharedUserId } from "@/lib/data";
import { sanitize, verifyUUID } from "@/lib/helpers";

export async function GET(req: NextRequest) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  // verify GET query
  const searchParams = req.nextUrl.searchParams;
  if (searchParams.get("list_id") === null) {
    return NextResponse.json(
      {
        message: "Missing parameters",
      },
      { status: 400 }
    );
  }
  const listId = searchParams.get("list_id");
  if (!verifyUUID(listId || "")) {
    return NextResponse.json(
      {
        message: "Invalid list_id",
      },
      { status: 400 }
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
      { status: 401 }
    );
  } else {
    try {
      const shared = await getShared(sanitize(listId || ""));
      if (shared) {
        if (!shared.rows.length) {
          return NextResponse.json(
            {
              message: "No shared found",
            },
            { status: 404 }
          );
        }
        if (
          shared.rows[0].shared_user_id &&
          shared.rows[0].shared_user_id === result.data.sub
        ) {
          return NextResponse.json(
            {
              shared: shared.rows,
            },
            {
              status: 200,
            }
          );
        } else {
          return NextResponse.json(
            {
              message: "Unauthorized",
            },
            { status: 401 }
          );
        }
      } else {
        return NextResponse.json(
          {
            message: "No shared todo list found",
          },
          { status: 404 }
        );
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to get shared: ${error}`,
        },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  // verify POST body
  const body = await req.json();
  if (!body || !body.list_id) {
    return NextResponse.json(
      {
        message: "Missing parameters",
      },
      { status: 400 }
    );
  }
  if (!verifyUUID(body.list_id)) {
    return NextResponse.json(
      {
        message: "Invalid list_id",
      },
      { status: 400 }
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
      { status: 401 }
    );
  } else {
    try {
      const shared = await addShared(body.list_id);
      return NextResponse.json(
        {
          sharedId: shared.rows[0].id,
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to add shared todo list: ${error}`,
        },
        { status: 500 }
      );
    }
  }
}

export async function PUT(req: NextRequest) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  // verify PUT body
  const body = await req.json();
  if (!body || !body.list_id) {
    return NextResponse.json(
      {
        message: "Missing parameters",
      },
      { status: 400 }
    );
  }
  if (!verifyUUID(body.list_id)) {
    return NextResponse.json(
      {
        message: "Invalid list_id",
      },
      { status: 400 }
    );
  }
  const shared = await getShared(body.list_id);
  if (!shared.rows.length || shared.rows[0].shared_user_id !== null) {
    return NextResponse.json(
      {
        message: "No shared found, or already shared",
      },
      { status: 404 }
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
      { status: 401 }
    );
  } else {
    try {
      await addSharedUserId(body.list_id, result.data.sub);
      return new Response(null, {
        status: 204,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to share todo list: ${error}`,
        },
        { status: 500 }
      );
    }
  }
}

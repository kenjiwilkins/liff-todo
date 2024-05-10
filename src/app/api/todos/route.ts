import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  findToDoListByCreatedUserId,
  addToDoListTable,
  deleteToDoListById,
} from "@/lib/data";

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
      const todos = await findToDoListByCreatedUserId(result.data.sub);
      console.log("todos", todos.rows);
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

export async function POST(req: NextRequest) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
  // verify POST body
  const body = await req.json();
  const { title, description } = body;
  if (!title || !description) {
    return NextResponse.json(
      {
        message: "Missing title or description",
      },
      { status: 400 },
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
    // create new todo list
    const todos = await addToDoListTable(title, description, result.data.sub);
    console.log("todos", todos);
    return NextResponse.json(
      {
        todos,
      },
      {
        status: 200,
      },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }
  // verify DELETE body
  const body = await req.json();
  const { id } = body;
  if (!id) {
    return NextResponse.json(
      {
        message: "Missing id",
      },
      { status: 400 },
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
    // delete todo list
    try {
      const todos = await deleteToDoListById(id);
      console.log("todos", todos);
      return new Response(null, {
        status: 204,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to delete todo: ${error}`,
        },
        {
          status: 500,
        },
      );
    }
  }
}

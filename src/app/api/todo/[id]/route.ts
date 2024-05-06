import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  findToDoListById,
  getTodoItemsByListId,
  addTodoItem,
  deleteTodoItem,
  setTodoItemDone,
} from "@/lib/data";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
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
      const todo = await findToDoListById(params.id);
      if (todo.rows[0].created_user_id !== result.data.sub) {
        return NextResponse.json(
          {
            message: "Unauthorized",
          },
          { status: 401 }
        );
      }
      const todoListItems = await getTodoItemsByListId(todo.rows[0].id);
      return NextResponse.json(
        {
          todoListItems: todoListItems.rows,
          todoList: todo.rows[0],
        },
        {
          status: 200,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to get todos: ${error}`,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  const body = await req.json();
  if (!body || !body.text) {
    return NextResponse.json(
      {
        message: "Invalid request body",
      },
      { status: 400 }
    );
  }
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
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
      const todo = await findToDoListById(params.id);
      if (todo.rows[0].created_user_id !== result.data.sub) {
        return NextResponse.json(
          {
            message: "Unauthorized",
          },
          { status: 401 }
        );
      }
      const todoItem = await addTodoItem(
        body.text,
        todo.rows[0].id,
        result.data.sub
      );
      return NextResponse.json(
        {
          todoItem: todoItem,
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to get todos: ${error}`,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
  if (!body || !body.done || typeof body.done !== "boolean") {
    return NextResponse.json(
      {
        message: "Invalid request body",
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
      await setTodoItemDone(params.id, body.done, result.data.sub);
      return new Response(null, {
        status: 204,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to update todos: ${error}`,
        },
        {
          status: 500,
        }
      );
    }
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const liffAccessToken = req.headers.get("x-liff-accesstoken");
  if (!liffAccessToken) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }
  // verify DELETE body
  const body = await req.json();
  if (!body || !body.list_id) {
    return NextResponse.json(
      {
        message: "Invalid request body",
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
      const todo = await findToDoListById(body.list_id);
      console.log(todo);
      if (todo.rows[0].created_user_id !== result.data.sub) {
        return NextResponse.json(
          {
            message: "Unauthorized",
          },
          { status: 401 }
        );
      }
      await deleteTodoItem(params.id);
      return new Response(null, {
        status: 204,
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          message: `Failed to get todos: ${error}`,
        },
        {
          status: 500,
        }
      );
    }
  }
}

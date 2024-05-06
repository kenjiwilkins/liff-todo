import {
  createToDoListTable,
  checkToDoListTable,
  dropToDoItemTable,
  dropToDoListTable,
  createToDoItemTable,
  createSharedTable,
  dropSharedTable,
  deleteAllTodoItems,
} from "@/lib/data";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const result = await createToDoItemTable();
  return new Response(JSON.stringify(result), { status: 200 });
}

export async function POST(request: Request) {
  const result = await dropToDoItemTable();
  return new Response(JSON.stringify(result), { status: 200 });
}

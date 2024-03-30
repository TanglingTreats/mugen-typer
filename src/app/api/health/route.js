import { NextResponse } from "next/server";

export async function GET(req) {
  return Response.json({ message: "ok" }, { status: 200, headers: { "Content-Type": "application/json" } });
}

import { NextResponse } from "next/server";
export async function POST(request) {
    try {
        return NextResponse.json({ message: "Logout successful" }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}

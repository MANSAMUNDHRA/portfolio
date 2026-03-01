import { NextRequest, NextResponse } from "next/server";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = "70508be635a04113819d1bc48e145e7e";

export async function POST(req: NextRequest) {
  const { message, from } = await req.json();

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_DB_ID },
      properties: {
        Message: { title: [{ text: { content: message } }] },
        From:    { rich_text: [{ text: { content: from || "Anonymous" } }] },
        Status:  { select: { name: "New" } },
        Time:    { date: { start: new Date().toISOString().split("T")[0] } },
      },
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
```

Then create `.env.local` in your project root:
```
NOTION_TOKEN=your_notion_integration_token
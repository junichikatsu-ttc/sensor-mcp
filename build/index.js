import { fetch } from "undici";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema, } from "@modelcontextprotocol/sdk/types.js";
const BASE_URL = process.env.BASE_URL?.replace(/\/$/, "") ||
    "https://lcdp005.enebular.com/ttc-sensor-data/";
// [1] サーバーインスタンスの初期化
const server = new Server({
    name: "sensor-mcp",
    version: "1.0.0",
}, {
    capabilities: {
        tools: {},
    },
});
// [2] 利用可能なToolの一覧を返す
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "get_sensor",
                description: "センサーの情報を時系列を取得します。",
                inputSchema: {
                    type: "object",
                    properties: {
                        no: {
                            type: "string",
                            description: "センサー番号（例: jk66302）",
                        },
                        startTime: {
                            type: "number",
                            description: "開始時刻(ミリ秒Unix)",
                        },
                        endTime: {
                            type: "number",
                            description: "終了時刻(ミリ秒Unix)",
                        },
                        limit: {
                            type: "number",
                            description: "最大件数。未指定なら100",
                        },
                    },
                },
            },
        ],
    };
});
// [3] Toolの利用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name !== "get_sensor") {
        throw new Error("Unknown prompt");
    }
    const { no, startTime, endTime, limit = 100 } = request.params.arguments;
    const url = new URL(BASE_URL);
    url.searchParams.set("no", no);
    url.searchParams.set("startTime", String(startTime));
    url.searchParams.set("endTime", String(endTime));
    url.searchParams.set("limit", String(limit));
    try {
        const res = await fetch(url.toString(), { method: "GET" });
        if (!res.ok) {
            return {
                content: [
                    {
                        type: "text",
                        text: `Upstream error: ${res.status} ${res.statusText}`
                    }
                ],
                isError: true
            };
        }
        const data = (await res.json());
        // そのまま JSON を返す（MCPの "json" コンテントとして）
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify(data)
                }
            ]
        };
    }
    catch (err) {
        return {
            content: [
                {
                    type: "text",
                    text: `Fetch failed: ${err?.message ?? String(err)}`
                }
            ],
            isError: true
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("cucon MCP Server (stdio) running");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});

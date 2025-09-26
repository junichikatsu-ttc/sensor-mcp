## IoT+AI科 2025年宿泊研修

### センサー連携用MCPサーバー

#### インストール方法
```shell
$ git clone https://github.com/junichikatsu-ttc/sensor-mcp.git
$ cd sensor-mcp
$ npm i
```

#### Claudeの設定例
1. 以下のファイルを開く
Windws： %APPDATA%\Claude\claude_desktop_config.json
Mac： ~/Library/Application Support/Claude/claude_desktop_config.json

2. 以下のように設定する

Windows:
```json
{
  "mcpServers": {
    "sensor-mcp": {
      "command": "node",
      "args": [
        "{gitからクローンしたフォルダ}\\sensor-mcp\\build\\index.js"
      ]
    }
  }
}
```

Mac:
```json
{
  "mcpServers": {
    "sensor-mcp": {
      "command": "node",
      "args": [
        "{gitからクローンしたフォルダ}/sensor-mcp/build/index.js"
      ]
    }
  }
}
```

const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

// publicディレクトリを静的ファイルとして公開
app.use(express.static('public')); 
app.use(express.json()); // JSON形式のリクエストボディを解析

// コマンド実行API
app.post('/command', (req, res) => {
  const { command } = req.body;
  
  // セキュリティのため、yt-dlpコマンドのみを許可
  if (command.startsWith('yt-dlp')) {
    // 実行中のyt-dlpコマンドの標準出力と標準エラー出力をリアルタイムで返す
    const child = exec(command);
    let output = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
      res.write(data.toString());
    });

    child.stderr.on('data', (data) => {
      output += data.toString();
      res.write(data.toString());
    });

    child.on('close', (code) => {
      res.end();
    });

  } else {
    // 許可されていないコマンドの場合はエラーを返す
    res.status(403).json({ error: '許可されていないコマンドです。' });
  }
});

// サーバー起動
app.listen(port, () => {
  console.log(`Web Terminalサーバーが http://localhost:${port} で起動しました`);
});

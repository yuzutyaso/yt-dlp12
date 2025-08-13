const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/command', (req, res) => {
  const { command } = req.body;
  
  // 許可するコマンドのリスト
  const allowedCommands = ['pip install yt-dlp', 'pip install ytsr', 'yt-dlp', 'ytsr'];
  
  if (allowedCommands.includes(command.split(' ')[0])) {
    const child = exec(command);
    
    child.stdout.on('data', (data) => {
      res.write(data.toString());
    });

    child.stderr.on('data', (data) => {
      res.write(data.toString());
    });

    child.on('close', (code) => {
      res.end();
    });

  } else {
    // 許可されていないコマンドはブロック
    res.status(403).json({ error: '許可されていないコマンドです。' });
  }
});

app.listen(port, () => {
  console.log(`Web Terminalサーバーが http://localhost:${port} で起動しました`);
});

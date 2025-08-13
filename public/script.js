document.getElementById('command-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const commandInput = e.target;
        const command = commandInput.value.trim();
        commandInput.value = '';

        if (!command) return;

        // yt-dlp または ytsr で始まるコマンドを許可する
        if (!command.startsWith('yt-dlp') && !command.startsWith('ytsr')) {
            addOutputLine(`許可されていないコマンドです: ${command}`, true);
            return;
        }

        addOutputLine(`$ ${command}`);

        fetch('/command', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ command: command })
        })
        .then(response => {
            const reader = response.body.getReader();
            let output = '';
            
            function read() {
                reader.read().then(({ done, value }) => {
                    if (done) {
                        return;
                    }

                    const text = new TextDecoder().decode(value);
                    output += text;
                    addOutputLine(text);
                    read();
                });
            }
            read();
        })
        .catch(err => {
            addOutputLine(`サーバーとの通信エラー: ${err}`, true);
        });
    }
});

function addOutputLine(text, isError = false) {
    const outputDiv = document.getElementById('output');
    const lines = text.split('\n');
    lines.forEach(line => {
        if (line.trim() === '') return;
        const lineDiv = document.createElement('div');
        lineDiv.textContent = line;
        if (isError) {
            lineDiv.style.color = 'red';
        }
        outputDiv.appendChild(lineDiv);
    });
    outputDiv.scrollTop = outputDiv.scrollHeight;
}

const WebSocket = require('ws');

const fs = require('fs');
const path = require('path');
const logFilePath = path.join(__dirname, 'app.log');

const wss = new WebSocket.Server({ port: 3003 });

wss.on('connection', function connection(ws) {
  console.log('connected');
  writeToLog('Cient Connected');

  ws.on('message', function incoming(message) {

    console.log('Received: %s', message);
    writeToLog(message);

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }

    });
  });

  ws.on('close', function close() {
    console.log('disconnected');
    writeToLog('Cient disonnected');
  });
});

const now = new Date();

const options = {
  timeZone: 'Asia/Jakarta',
  hour12: false, // Format 24 jam
  weekday: 'long', // Hari (Senin, Selasa, ...)
  year: 'numeric', // Tahun (misalnya 2023)
  month: 'long', // Bulan (Januari, Februari, ...)
  day: 'numeric', // Tanggal (1, 2, ...)
  hour: 'numeric', // Jam (0-23)
  minute: 'numeric', // Menit (0-59)
  second: 'numeric' // Detik (0-59)
};

const dateTimeFormat = new Intl.DateTimeFormat('id-ID', options);
const formattedDateTime = dateTimeFormat.format(now);

function writeToLog(message) {
  const logMessage = `${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
}

import WebSocket from 'ws';

const ws = new WebSocket('ws://127.0.0.1:3000/api/echo');

ws.on('error', console.error);

ws.on('open', function open() {
  ws.send('something');
});

ws.on('message', function message(data) {
  console.log('received: %s', data);
});

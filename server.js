
// HTTP SERVER
import express from 'express';
import cors from 'cors';

const app = express();

function setPort(port = 5000) {
  app.set('port', parseInt(port, 10));
}

function listen() {
  const port = app.get('port') || 5000;
  app.listen(port, () => {
    console.log(`The server is running and listening at http://localhost:${port}`);
  });
}

app.use(cors({
  origin: '*', // Be sure to switch to your production domain
  optionsSuccessStatus: 200
}));

// Endpoint to check if the API is running
app.get('/api/status', (req, res) => {
  res.send({ status: 'ok' });
});
const server = {
  getApp: () => app,
  setPort,
  listen
};

server.listen();

export default server;

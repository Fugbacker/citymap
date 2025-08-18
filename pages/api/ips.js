import os from 'os';

export default function handler(req, res) {
  const nets = os.networkInterfaces();
  const ipList = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (
        net.family === 'IPv4' &&
        !net.internal &&
        !net.address.startsWith('192.168.') &&
        !net.address.startsWith('10.') &&
        !net.address.startsWith('172.')
      ) {
        ipList.push(net.address);
      }
    }
  }

  res.status(200).json(ipList);
}
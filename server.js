import express from 'express';
import { networkInterfaces } from 'node:os';
import { fileURLToPath } from 'node:url';

const app = express();
app.use(express.static(fileURLToPath(new URL('./public', import.meta.url))));

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('Math4Primary is running at:');
  console.log(`  This computer:  http://localhost:${port}`);
  const lanAddresses = Object.values(networkInterfaces())
    .flat()
    .filter((net) => net.family === 'IPv4' && !net.internal);
  for (const net of lanAddresses) {
    console.log(`  Other devices:  http://${net.address}:${port}`);
  }
});

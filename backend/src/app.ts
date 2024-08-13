import express, { Express } from 'express';
import { getServer } from './utils/setupServers';
import { getConfigOrThrow } from './utils/config';
import databaseConnection from './utils/setupDatabase';

const config =  getConfigOrThrow()
try {
  if(config instanceof Error) {
    throw new Error(config.message)
  }


  const app: Express = express();

  databaseConnection(config);

  const server = getServer(app, config);
  server.start();
}
catch(e) {
  console.log(e)
}
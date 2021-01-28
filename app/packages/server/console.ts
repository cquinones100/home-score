import repl from 'repl';
import getHomes from './src/queries/getHomes';
import dbConnection from './src/dbConnection';

const replOptions = {
  prompt: "console > ",
};

const start = async () => {
  const replServer = repl.start({ useColors: true });
  replServer.setupHistory(__dirname + "replHistory", () => {});

  replServer.context.getHomes = getHomes;
  replServer.context.dbConnection = dbConnection;
};

start();

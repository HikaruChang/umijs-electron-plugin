import { app as electronApp, BrowserWindow } from 'electron';
import path from 'path';
import fs from 'fs';

electronApp.on('ready', () => {
  let userConfig: { browserWindow?: Electron.BrowserWindowConstructorOptions } = {};

  if (fs.existsSync(path.join(__dirname, './config.js'))) {
    userConfig = require('./config').default;
  }

  const bw = new BrowserWindow({
    ...userConfig.browserWindow,
    webPreferences: {
      ...(userConfig.browserWindow?.webPreferences || {}),
      preload: path.join(__dirname, './preload.js'),
    },
  });
  bw.loadFile(path.join(__dirname, './renderer/index.html')).then(() => {
    require('./index.js');
  });

  // ipc
  try {
    fs.readdirSync(path.join(__dirname, './ipc')).forEach((file) => {
      const ipcFilepath = path.join(__dirname, './ipc', file);
      require(ipcFilepath);
    });
  } catch (error) {
    console.log(error);
  }
});

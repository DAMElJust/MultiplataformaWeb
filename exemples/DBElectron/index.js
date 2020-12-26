
// Carreguem la llibreria electron
// app: Per controlar el cicle de vida de l'aplicació
// BrowserWindow: Per controlar la finestra de l'aplicació
const { app, BrowserWindow, ipcMain } = require('electron')
fs = require('fs')

// Llibreria d'accés a la BD
const db = require('./dbAccess.js');

// Cal crear una referència global a l'objecte finestra, ja que si no, 
// l'aplicació es tancaría quan passara el recol·lector de fem.
let mainWindow;

// Creem un objecte de tipus dbAcces per accedir a la BD
let mydb = new db.dbAccess();

function createWindow() {
  // Crea la finestra del navegador
  mainWindow = new BrowserWindow(
    {
      width: 1024,
      height: 768,
      webPreferences: {
        //nodeIntegration: true,
        nodeIntegration: false,
        contextIsolation: true, // protect against prototype pollution
        enableRemoteModule: false, // turn off remote
        preload: __dirname + '/preload.js'
      }
    }
  );




  mainWindow.setMenu(null);

  //I carreguem en ella l'índex de la pàgina
  mainWindow.loadFile('ui/mainWindow.html')

  // Si volem obrir les devtools en la mateixa finestra, faríem:
  //mainWindow.webContents.openDevTools();

  // I per obrir-les en una finestra a banda..

  if (process.argv.length === 3 && process.argv[2] === "debug") {
    devtools = new BrowserWindow()
    mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  /* Gestió d'events de la finestra */

  // Detectem l'event de tancar la finestra principal
  mainWindow.on('closed', function () {
    mainWindow = null
  })


  /*
  // Exemple ping-pong
  ipcMain.on("PingPong", (event, args) => {
    console.log(args.missatge);
    if (args.async) //event.sender.send('CanalResposta', 'pong1')
      mainWindow.webContents.send('PingPong', "Pong Async");
    else event.returnValue = "Pong Sync"
  })*/

  ipcMain.on("DBPelis", (event, args) => {
    switch (args.requestKey) {

      case "getAllPelis":
        mydb.getAllMovies(function (Pelis) {
          mainWindow.webContents.send("DBPelis", { "requestKey": "getAllPelis", "data": Pelis });
        })
        break;

      case "saveNewPeli":
        mydb.saveNewPeli(args.data.titol, args.data.any, args.data.director, function (ret) {
          mainWindow.webContents.send("DBPelis", { "requestKey": "saveNewPeli", "data": ret });

        })
        break;
        
      case "removePeliFromBD":
        mydb.deletePeli(args.data.peliId, function(ret){
          mainWindow.webContents.send("DBPelis", { "requestKey": "removePeliFromBD", "data": ret });
        })

        break;

      case "updatePeli":
        mydb.updatePeli(args.data.peliId, args.data.titol, args.data.any, args.data.director, function (ret) {
          mainWindow.webContents.send("DBPelis", { "requestKey": "updatePeli", "data": ret });

        })
        break;
  

    }
  })



  /*ipcMain.on("toMain", (event, args) => {
    fs.readFile("/tmp/kk", (error, data) => {
      // Do something with file contents
  
      // Send result back to renderer process
      mainWindow.webContents.send("fromMain", "hola");
    });
  
  })*/




}


/* Gestió d'events de l'aplicació */

// Detectem l'event d'inicialització d'electron
// Quan estiga inicialitzat, podrem accedir a les seues APIs i 
// crear la finestra principal.
app.on('ready', function () {
  createWindow();
});


// Ajustos per a mac

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})



















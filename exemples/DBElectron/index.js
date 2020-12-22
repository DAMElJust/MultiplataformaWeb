
// Carreguem la llibreria electron
// app: Per controlar el cicle de vida de l'aplicació
// BrowserWindow: Per controlar la finestra de l'aplicació
const { app, BrowserWindow } = require('electron')

// Cal crear una referència global a l'objecte finestra, ja que si no, 
// l'aplicació es tancaría quan passara el recol·lector de fem.
let mainWindow;

function createWindow() {
  // Crea la finestra del navegador
  mainWindow = new BrowserWindow(
    {
      width: 1024,
      height: 768,
      webPreferences: {
        nodeIntegration: true
        //nodeIntegration: false
      }
    }
  );




  mainWindow.setMenu(null);

  //I carreguem en ella l'índex de la pàgina
  mainWindow.loadFile('ui/mainWindow.html')

  // Si volem obrir les devtools en la mateixa finestra, faríem:
  //mainWindow.webContents.openDevTools();

  // I per obrir-les en una finestra a banda..

  if (process.argv.length===3 && process.argv[2]==="debug"){
    devtools = new BrowserWindow()
    mainWindow.webContents.setDevToolsWebContents(devtools.webContents);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  /* Gestió d'events de la finestra */

  // Detectem l'event de tancar la finestra principal
  mainWindow.on('closed', function () {
    mainWindow = null
  })

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



















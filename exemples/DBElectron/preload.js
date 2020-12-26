// Ja no exportem tot l'objecte ipcRenderer a la finestra (insegur)
// DEPRECAT: window.ipcRenderer = require('electron').ipcRenderer;

// Ens definim internament dos constants, l'ipcRenderer i contextBridge,
// aquest últim farà de pont entre els dos contextos (Main i Renderer)
const {
    contextBridge,
    ipcRenderer
} = require("electron");

// Dins el contextBridge, amb el mètode exposeInMainWorld, indiquem 
// els mètodes que permetran al procés Renderer utilitzar ipcRenderer, 
// en lloc d'exposar tot l'objecte. 
// El primer argument que tindrà ("api") és l'objecte que serà visible
// des de la finestra principal, i que contindrà els mètodes necessaris
// PEr fer la comunicació.

contextBridge.exposeInMainWorld(
    "api", {
        send: (channel, data) => {
          /*
          Mètode send, per enviar missatges asíncrons per ipcRenderer:
          Defineix una llista de canals vàlids per filtrar les peticions.
          */

          // Llista de canals vàlids
          let validChannels = ["PingPong", "DBPelis"];
          if (validChannels.includes(channel)) {
            // Si el canal pel que s'envia la informació és vàlid
            // s'envia per ipcRenderer.
              ipcRenderer.send(channel, data);
          }
        },
        sendSync: (channel, data) => {
          /*
          Mètode sendSync, per enviar missatges síncrons per ipcRenderer.
          Funciona igual que send, però fa un return del resultat.
          */
          let validChannels = ["PingPong", "DBPelis"];
          if (validChannels.includes(channel)) {
              return ipcRenderer.sendSync(channel, data);
          }
        },
        receive: (channel, func) => {
          /*
          Mètode receive, per rebre resposta als missatges asíncrons.
          També estableix una llista de canals vàlids per filtrar missatges.
          func és la funció de callback que li passem i que s'invocarà
          quan es reba resposta.
          */
          let validChannels = ["PingPong", "DBPelis"];
          if (validChannels.includes(channel)) {
              // Invocació de la funció de callback en rebre resposta
              // per ipcRenderer. Fixeu-vos en l'ús de l'operador "..." 
              // per indicar "la llista d'arguments restants"
              ipcRenderer.on(channel, (event, ...args) => {
                  console.log(event);
                  console.log(args);
                  func(...args);}
              );
          }
        }
    }
);
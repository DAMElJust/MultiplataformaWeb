// DEPRECATED // const { ipcRenderer } = require('electron');
// DEPRECATED // const db = require('./js/dbAccess.js');

class mainWindow {
    constructor() {
        // DEPRECATED //  this.mydb=new db.dbAccess();

    };

    drawTable(Pelis) {
        let self = this;

        // Recorrem el JSON de Pelis, creant una fila per cada component
        for (let Peli in Pelis) {
            let tr = document.createElement("tr");

            for (let camp in Pelis[Peli]) {
                if (camp == "idPelis") {
                    // Si es tracta de la clau principal, afegim el seu valor com a 
                    // atribut de la fila, de manera que es puga identificar internament.
                    tr.targetID = Pelis[Peli][camp];
                    continue;
                }

                let td = document.createElement("td");
                let text = document.createTextNode(Pelis[Peli][camp]);
                // Afegim les dadeas de la peli com a atributs de la fila
                tr[camp] = Pelis[Peli][camp];
                td.append(text);

                tr.append(td);
            }

            // Botó per modificar la peli
            let bt = document.createElement("button");
            bt.className = "btn btn-outline-primary btn-circle";
            let icon = document.createElement("i");
            icon.className = "far fa-edit";
            bt.append(icon);
            let td = document.createElement("td");

            td.append(bt);
            tr.append(td);
            bt.addEventListener("click", function () {
                self.modificaPeli(this.parentNode.parentNode);
            });

            // Botó per eliminar la peli

            bt = document.createElement("button");
            bt.className = "btn btn-outline-danger btn-circle";
            icon = document.createElement("i");
            icon.className = "far fa-trash-alt";
            bt.append(icon);
            td = document.createElement("td");

            td.append(bt);
            tr.append(td);
            bt.addEventListener("click", function () {
                self.deletePeli(this.parentNode.parentNode);
            });

            // Finalment afegim al cos de la taula la fila 
            let tablebody = document.querySelector("#tableBody");
            tablebody.append(tr);
        }
        
    }


    modificaPeli(row) {
        // Afegim les dades de la peli al diàleg modal
        document.getElementById("Titol").value = row.Titol;
        document.getElementById("Any").value = row.Any;
        document.getElementById("Director").value = row.Director;

        // Afegim l'id de la peli (guardat en row.targetId) al botó de saveData
        document.getElementById("SaveData").peliId = row.targetID;

        // Enviem l'event click al botó d'obrir el diàleg
        document.getElementById("myModalTrigger").click();
    }

    deletePeli(row) {
        let self = this;

        let data = {
            "peliId": row.targetID
        }

        let ret = confirm("Desitgeu eliminar la pel·lícula?");
        if (ret) window.api.send("DBPelis", { "requestKey": "removePeliFromBD", "data": data });

    }

    getPelis() {
        // Obté les pel·lícules de la BD
        // Enviem un missatge a l'IPCMain a través de l'API que ens
        // proporciona el contextBridge.
        // El misstge anirà pel canal "DBPelis", i li enviarem
        // un JSON amb la clau "requestKey":"getAllPelis"
        // Aquesta clau servirà per tractar la resposta al mètode
        // manageRequestResponses, amb el mateix significat que
        // el requestCode de Kotlin per als Intents en Android.
        
        window.api.send("DBPelis", { "requestKey": "getAllPelis" });


    }

    saveNewPeli(titol, any, director) {
        let self = this;
        // Guarda la peli introduïda al formulari a la base de dades

        // Preparem les dades
        let data = {
            "titol": titol,
            "any": any,
            "director": director
        }
        window.api.send("DBPelis", { "requestKey": "saveNewPeli", "data": data });

    }

    updatePeli(PeliId, titol, any, director) {
        let self = this;

        // Preparem les dades
        let data = {
            "peliId": PeliId,
            "titol": titol,
            "any": any,
            "director": director
        }

        // I fem la petició
        window.api.send("DBPelis", { "requestKey": "updatePeli", "data": data });

    }

    addEventsListeners() {
        // Funció que enllaça els events de la interfície amb els seus manejadors

        let self = this;

        document.querySelector("#addNewPeli").addEventListener("click", function () {
            // Enllacm el botó d'afegir una peli amb el que obre el diàleg, 
            // netejant abans el contingut

            document.getElementById("Titol").value = "";
            document.getElementById("Any").value = "";
            document.getElementById("Director").value = "";
            document.getElementById("SaveData").peliId = "";

            // Enviem l'event click al botó d'obrir el diàleg
            document.querySelector("#myModalTrigger").click();
        });


        document.querySelector("#SaveData").addEventListener("click", function () {

            // Clic en el botó de guardar del formulari
            let titol = document.querySelector("#Titol").value;
            let any = document.querySelector("#Any").value;
            let director = document.querySelector("#Director").value;

            let PeliId = document.querySelector("#SaveData").peliId;

            if (PeliId === "" || typeof (PeliId) === "undefined")
                self.saveNewPeli(titol, any, director);
            else self.updatePeli(PeliId, titol, any, director);

        })

        /*
        // Exemple ping-pong
        let ret = window.api.sendSync("PingPong", { "missatge": "ping Sync", "async": false });
        console.log(ret);


        
        window.api.receive("PingPong", (data) =>{
            console.log(`Rebent ${data}`);
        });
        window.api.send("PingPong", {"missatge": "ping Async", "async":true});
        */



    }

    manageRequestResponses() {
        self = this;
        window.api.receive("DBPelis", (response) => {
            switch (response.requestKey) {
                case "getAllPelis":
                    self.drawTable(response.data);
                    break;

                case "saveNewPeli":
                    if (response.data.error != null)
                        alert("Error, no s'han inserit les dades");
                    else if (response.data.result.affectedRows == 1) {
                        alert("S'ha afegit el registre");
                        // Amaguem el diàleg
                        document.querySelector("#btCloseModal").click();
                        // Netegem la taula
                        document.querySelector("#tableBody").innerHTML = "";
                        self.getPelis();
                    }

                    break;

                case "removePeliFromBD":
                    if (response.data.error != null)
                        alert("Error, no s'ha eliminat el registre");
                    else if (response.data.result.affectedRows == 1) {
                        alert("S'ha eliminat el registre");
                        // Netegem la taula
                        document.querySelector("#tableBody").innerHTML = "";
                        self.getPelis();
                    };
                    break;

                case "updatePeli":
                    if (response.data.error != null)
                    alert("Error, no s'han modificat les dades");
                else if (response.data.result.affectedRows == 1) {
                    alert("S'ha modificat el registre");
                    // Amaguem el diàleg
                    document.querySelector("#btCloseModal").click();

                    // Netegem la taula
                    document.querySelector("#tableBody").innerHTML = "";
                    self.getPelis();

                    }
        
            }

        });

    } // manageRequestResponses
}


window.onload = function () {
    // Esdeveniment que es dispara en tindre el HTML carregat
    // una vegada carregat, inicialitzem tots els objectes de l'aplicació
    let main = new mainWindow();

    // Obtenim les pelis de la BD i les mostrem a la taula
    main.getPelis();

    // I afegim els gestors dels esdeveniments
    main.addEventsListeners();

    // I els gestors de les respostes d'IMCMain
    main.manageRequestResponses();

}; 

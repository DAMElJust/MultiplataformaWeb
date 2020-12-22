const db = require('./js/dbAccess.js');

class Index {
    constructor(){
        this.mydb=new db.dbAccess();
        
     };

    drawTable(Pelis){
        let self=this;

        // Recorrem el JSON de Pelis, creant una fila per cada component
        for (let Peli in Pelis){
            let tr=document.createElement("tr");

            for (let camp in Pelis[Peli]){
                if (camp=="idPelis") {
                    // Si es tracta de la clau principal, afegim el seu valor com a 
                    // atribut de la fila, de manera que es puga identificar internament.
                    tr.targetID=Pelis[Peli][camp];
                    continue;
                }

                let td=document.createElement("td");
                let text=document.createTextNode(Pelis[Peli][camp]);
                // Afegim les dadeas de la peli com a atributs de la fila
                tr[camp]=Pelis[Peli][camp];
                td.append(text);

                tr.append(td);
            }

            // Botó per modificar la peli
            let bt=document.createElement("button");
            bt.className="btn btn-outline-primary btn-circle";
            let icon=document.createElement("i");
            icon.className="far fa-edit";
            bt.append(icon);
            let td=document.createElement("td");

            td.append(bt);
            tr.append(td);
            bt.addEventListener("click", function(){
                self.modificaPeli(this.parentNode.parentNode);
            });
            
            // Botó per eliminar la peli

            bt=document.createElement("button");
            bt.className="btn btn-outline-danger btn-circle";
            icon=document.createElement("i");
            icon.className="far fa-trash-alt";
            bt.append(icon);
            td=document.createElement("td");

            td.append(bt);
            tr.append(td);
            bt.addEventListener("click", function(){
                self.deletePeli(this.parentNode.parentNode);
            });

            // Finalment afegim al cos de la taula la fila 
            let tablebody=document.querySelector("#tableBody");
            tablebody.append(tr);
        } 
        console.log(Pelis);
    }


    modificaPeli(row){
        // Afegim les dades de la peli al diàleg modal
        document.getElementById("Titol").value=row.Titol;
        document.getElementById("Any").value=row.Any;
        document.getElementById("Director").value=row.Director;

        // Afegim l'id de la peli (guardat en row.targetId) al botó de saveData
        document.getElementById("SaveData").peliId=row.targetID;
    
        // Enviem l'event click al botó d'obrir el diàleg
        document.getElementById("myModalTrigger").click();
    }

    deletePeli(row){
        let self=this;
        let peliId=row.targetID;
        let ret=confirm("Desitgeu eliminar la pel·lícula?");
        if(ret) self.removePeliFromBD(peliId);
    }

    removePeliFromBD(peliId){
        let self=this;
        // Eliminem la peli de la BD
        this.mydb.deletePeli(peliId, function(ret){
            console.log(ret);
            if (ret.error!=null) alert("Error, no s'ha eliminat el registre");
                
            else if (ret.result.affectedRows==1) {
                alert("S'ha eliminat el registre");
                
                // Netegem la taula
                document.querySelector("#tableBody").innerHTML="";
                
                self.getPelis(function(Pelis){
                    self.drawTable(Pelis);
                }); 
            };

        });


        
    }

    getPelis(callback){
        // Obté les pel·lícules de la BD
        this.mydb.getAllMovies(function(Pelis){
            callback(Pelis);    
        });

    }

    saveNewPeli(titol, any, director){
        let self=this;
        // Guarda la peli introduïda al formulari a la base de dades

        this.mydb.saveNewPeli(titol, any, director, function(ret){
            if (ret.error!=null) alert("Error, no s'han inserit les dades");
            else if (ret.result.affectedRows==1) {
                alert("S'ha afegit el registre");

                // Amaguem el diàleg
                document.querySelector("#btCloseModal").click();

                // Netegem la taula
                document.querySelector("#tableBody").innerHTML="";

                self.getPelis(function(Pelis){
                    self.drawTable(Pelis);
                });
            }
            
        });
    }

    updatePeli(PeliId, titol, any, director){
        let self=this;
        // Modifica la peli introduïda al formulari a la base de dades

        this.mydb.updatePeli(PeliId, titol, any, director, function(ret){
            if (ret.error!=null) alert("Error, no s'han modificat les dades");
            else if (ret.result.affectedRows==1) {
                alert("S'ha modificat el registre");
                
                // Amaguem el diàleg
                document.querySelector("#btCloseModal").click();
    
                // Netegem la taula
                document.querySelector("#tableBody").innerHTML="";
                self.getPelis(function(Pelis){
                    self.drawTable(Pelis);
                });
            }
            
        });
    }

    addEventsListeners(){
        // Funció que enllaça els events de la interfície amb els seus manejadors

        let self=this;

        document.querySelector("#addNewPeli").addEventListener("click", function(){
            // Enllacm el botó d'afegir una peli amb el que obre el diàleg, 
            // netejant abans el contingut

            document.getElementById("Titol").value="";
            document.getElementById("Any").value="";
            document.getElementById("Director").value="";
            document.getElementById("SaveData").peliId="";
        
            // Enviem l'event click al botó d'obrir el diàleg
            document.querySelector("#myModalTrigger").click();
        });


        document.querySelector("#SaveData").addEventListener("click", function(){
            
            // Clic en el botó de guardar del formulari
            let titol=document.querySelector("#Titol").value;
            let any=document.querySelector("#Any").value;
            let director=document.querySelector("#Director").value;

            let PeliId=document.querySelector("#SaveData").peliId;
            
            if (PeliId==="" || typeof(PeliId)==="undefined")
                self.saveNewPeli(titol, any, director);
            else self.updatePeli(PeliId, titol, any, director);

        })
    }
}


window.onload = function(){
    // Esdeveniment que es dispara en tindre el HTML carregat
    // una vegada carregat, inicialitzem tots els objectes de l'aplicació
    let index=new Index();

    index.getPelis(function(Pelis){
        // Obtenim les pelis de la BD i les mostrem a la taula
        index.drawTable(Pelis);
    });

    // I afegim els gestors dels esdeveniments
    index.addEventsListeners();

}; 

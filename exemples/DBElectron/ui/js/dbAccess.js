var mysql = require('mysql');

class dbAccess{

    constructor(){};
    
    getConnection(){
        // Retorna una connexió a la BD MySQL
        return mysql.createConnection({
            insecureAuth : true, 
            host     : '127.0.0.1',
            port     : '3308',
            user     : 'node',
            password : 'node',
            database : 'cine'
          }); 
    }

    getAllMovies(callback){
        // Llista totes les pel·lícules de la BD

        // 1. Obtenim la connexió
        let connection=this.getConnection();
        
        let Pelis=[];

        // 2. Ens connectem a la BD
        connection.connect();

        // 3. Fem la consulta
        connection.query('SELECT idPelis, Titol, Any, Director FROM Pelis', function (error, results, fields) {
            if (error) throw error;
                      
            // Recorrem els resultats i creem un JSON
            for (let index_result in results){
                let peli={};
                for (let index_camp in fields)
                {
                    // Anem afegint valors al JSON
                    let indexName=fields[index_camp].name;
                    let attrValue=results[index_result][indexName]
                    peli[indexName]=attrValue;
                }
                // i afegim el JSON al vector
                Pelis.push(peli);
            }
            // 4. Tanquem la connexió
            connection.end();

            // I finalment, invoquem la funció de callback amb els resultats
            callback(Pelis);

          });
        
    }

    saveNewPeli(titol, any, director, callback){
        // Guarda les dades d'una nova pel·lícula

        // 1. Creem la connexió
        let connection=this.getConnection();

        // 2. Ens connectem
        connection.connect();

        // 3. Fem la consulta, fent correspondre els arguments als placeholders amb un vector
        let query="INSERT INTO `cine`.`Pelis` (`Titol`, `Any`, `Director`)"+
        " VALUES (?, ?, ?);";
        connection.query(query, [titol, any, director] ,function (error, results, fields) {
            callback({"error":error, "result":results});
          });
    }


    updatePeli(PeliId, titol, any, director, callback){
        // Modifica les dades d'una nova pel·lícula

        // 1. Creem la connexió
        let connection=this.getConnection();

        // 2. Ens connectem
        connection.connect();

        // 3. Fem la consulta, fent correspondre els arguments als placeholders amb un vector
        let query="UPDATE `cine`.`Pelis` SET `Titol` = ?, "+
        "`Any`=?, `Director`= ? WHERE `idPelis` = ?;";
        console.log(query);
        connection.query(query, [titol, any, director, PeliId] ,function (error, results, fields) {
            console.log(error);
            callback({"error":error, "result":results});
          });
    }


    deletePeli(PeliId, callback){
        // Modifica les dades d'una nova pel·lícula

        // 1. Creem la connexió
        let connection=this.getConnection();

        // 2. Ens connectem
        connection.connect();

        // 3. Fem la consulta, fent correspondre els arguments als placeholders amb un vector
        let query="DELETE FROM `cine`.`Pelis` WHERE `idPelis` = ?;";
        
        connection.query(query, [PeliId] ,function (error, results, fields) {
            callback({"error":error, "result":results});
          });
    }
}


// Cal exportar la classe per poder utilitzar-la des de fora
module.exports = {  
    dbAccess: dbAccess
}
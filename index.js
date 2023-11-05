const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");

//config de la base de données
connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "descartes"
})

connection.connect((error) =>{
    if (error) console.log ("MySQL❌ : Erreur de connexion à la DB");
    else console.log("Mysql ✅ : Connexion à la DB établie");
});


//config de express
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

app.get("/decks", (request, response) =>{
    sql = "SELECT * FROM decks";
    connection.query(sql, (error, results) =>{
        if (error) console.log("Erreur, decks non lu ❌");
        else{
            console.log("Decks lu✅");
            const formatedResults = results.map(result =>{
                return `
                    <form action="">
                        <a href="#lol" onclick="this.parentNode.submit();"><h4 style='background-color : #9a4ae5; padding: 0px 100px 0px 100px; border-radius: 5px; color: #171716;'>nom : ${result.name}</h4> <h4 style='background-color : #9a4ae5; padding: 0px 100px 0px 100px; border-radius: 5px; color: #171716'>auteur : ${result.author}</h4> </a>
                    </form>`;
            });
            formatedResponse = formatedResults.join("");
            response.json(formatedResponse);
        }
    });
});

app.post("/deckmake", (request, response) =>{
    const author = request.body.author;
    const name = request.body.name;

    post = {author: author, name: name};
    sql = "INSERT INTO decks SET ?";

    let query = connection.query(sql, post, (error) =>{
        if (error) console.log("Erreur d'envoie de données❌");
        else{
            console.log("Envoie de données réussi !✅");
            response.redirect("/");
        }   
    });
});




app.listen(port, (error) =>{
    if (error) console.log("Express : ❌Erreur du démarrage du serveur express.");
    else console.log("Express ✅ : Démarrage du serveur express établie sur le port", port);
});
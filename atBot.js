const superSecretKey = require('./config.js').token;
const Slimbot = require('slimbot');
const slimbot = new Slimbot(superSecretKey);
const fs = require('fs');
const { send } = require('process');

function writetoDB(newjson){
    fs.writeFile(dbFile, JSON.stringify(newjson), function writeJSON(err) {
        if (err) return console.log(err);
    });
}

var dbFile= "atBotDB.json";
var db
try{
    readFile = fs.readFileSync(dbFile);
    db = JSON.parse(readFile)
}catch(err){
    console.log("couldn't open db.")
    db = {};
}

slimbot.on('message', message => {
    if(message.text.includes('/creategroup')){
        var homiesToAdd = []
        var tag = ""

        const entities = message.entities;
        entities.forEach((entity) => {
            if(entity.type=='mention'){
                start = entity.offset;
                end = entity.offset + entity.length;
                homie = message.text.slice(start, end);
                homiesToAdd.push(homie)
            }
        });

        const allshit = message.text.split(' ');
        allshit.forEach((shitter) => {
            if(!homiesToAdd.includes(shitter)){
                tag = "@"+shitter;
            }
        });
        db[tag] = homiesToAdd;
        writetoDB(db);
    }else{
        if(message.text.includes('@')){
            if(message.text.includes(' ')){
                splitmsg = message.text.split(' ');
                potentialDawgs = [];
                splitmsg.forEach((dawg)=>{
                    if(dawg.includes('@')){
                        potentialDawgs.push(dawg)
                    }
                })
                sendstr = "";
                potentialDawgs.forEach(facts =>{
                    if(Object.keys(db).includes(facts)){
                        db[facts].forEach(z=>{
                            sendstr+=z+" ";
                        })
                    }
                })
                if(sendstr != ""){
                    slimbot.sendMessage(message.chat.id, sendstr);
                }
            }else{
                if(Object.keys(db).includes(message.text)){
                    sendstr = "";
                    db[message.text].forEach((x)=>{
                        sendstr+=x+" ";
                    })
                    slimbot.sendMessage(message.chat.id, sendstr)
                }
            }
        }
    }
});

slimbot.startPolling();
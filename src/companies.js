const db = require('sqlite');
const fs = require('fs');

const responseHandler = require('./responseHandler');
const config = require('../config.json');


const checkDatabase = () => {
    return db.run("CREATE TABLE IF NOT EXISTS companies (id varchar(250) PRIMARY KEY, name varchar(150));");
};

const removeQuote = (string) => {
    return string.replace(/\'/g, "''");
};


const addCompany = (name, id) => {
    name = removeQuote(name);
    id = removeQuote(id);
    db.run(`INSERT OR IGNORE INTO companies (id,name) VALUES('${id}','${name}');`);
};
/**
 * Imports a json file into the db
 * @param {*} file file-location
 * @param {*} key the object where the stations are put in if the json not only contains an array of stations
 * @param {*} type the type of transport inside the json
 * @param {*} company the company offering the transport
 */
const importJson = (file) => {

    fs.readFile(file, (err, data) => {
        if (err) {
            console.log(err);
        }

        data = JSON.parse(data);
        let companies = data;

        for (let company of companies) {
            addCompany(company['standardname'],company['id']);

        }
        console.log("Companies in dataset", file, ":", companies.length);
    });
}



const getCompany = (query) => {
    let sqlQuery = 'SELECT * FROM companies ';
    let parameters = [];
    let nextPage = `${config.domain}/company`;
    let response = {};
    sqlQuery = 'SELECT * FROM companies ';
    if (query.name) {
        sqlQuery += 'WHERE '
        nextPage += parameters.length > 0 ? '&' : '?';
        nextPage += `q=${query.name}`;
        sqlQuery += parameters.length > 0 ? ' AND' : "";
        sqlQuery += ' (name LIKE ?)';
        parameters.push(`%${query.name}%`);
    }
    sqlQuery += ' LIMIT 25';
    if (query.page && !isNaN(query.page)) {
        query.page = parseInt(query.page)
        sqlQuery += ` OFFSET ${query.page}`;
    } else {
        query.page = 0;
    }
    return new Promise((resolve, reject) => {
        console.log(sqlQuery);
        db.all(sqlQuery, parameters)
            .then((row) => {
                // console.log(row);
                if (row.length >= 25) {
                    nextPage += parameters.length > 0 ? '&' : '?';
                    nextPage += `p=${(query.page + 1)}`;
                    response.nextPage = nextPage;
                }
                response.companies = row;
                resolve(response);
            })
            .catch((e) => {
                // console.log(e);
                reject(e);
            });
    });
}

const fillDatabase = () => {
    importJson("data/companies.json");
}

const registerListeners = (app) => {
    checkDatabase().then(() => {
        fillDatabase();
        app.get('/company', function (req, res) {
            if (req.query) {
                res.setHeader('Content-Type', 'application/json');
                res.header("Access-Control-Allow-Origin", "*");
                let searchQuery = {};
                let valueSet = false;
                if (req.query.q) {
                    searchQuery["name"] = `${req.query.q}`;
                    valueSet = true;
                }
                return getCompany(searchQuery)
                    .then((data) => {
                        res.send(JSON.stringify(data));
                    })
                    .catch(e => JSON.stringify(responseHandler.generateError("No data found.")));
            }
        });
    }).catch(e => console.log(e));
}

module.exports.registerListeners = registerListeners;
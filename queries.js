const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    },
    console.log(`Connected to the ${process.env.DATABASE} database.`)
);

async function getRoles() {
    return new Promise((resolve, reject) => {
        try {
            db.query("SELECT id, title FROM role", (err, results) => {
                resolve(results);
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function getEmployeeNames() {
    return new Promise((resolve, reject) => {
        try {
            db.query("SELECT id, CONCAT(first_name, ' ', last_name) as Name FROM employee", async (err, employees) => {
                resolve(employees);
            });
        } catch (err) {
            reject(err);
        }
    });
}

async function getDepartments(){
    return new Promise((resolve, reject) => {
        try {
            db.query("SELECT * FROM department", (err, result)=>{
                resolve(result);
            });
        } catch (err){
            reject(err);
        }
    });
}

module.exports = {
    getRoles,
    getEmployeeNames,
    getDepartments
}

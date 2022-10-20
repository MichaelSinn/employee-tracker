const mysql = require("mysql2");
require("dotenv").config();
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    }
);

// Gets all roles' id and titles
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

// Gets all employee's id and full names
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

// Gets all departments
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

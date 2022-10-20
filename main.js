const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    },
    console.log(`Connected to the classlist_db database.`)
);

const menuPrompt = [
    {
        type: "list",
        name: "menu",
        message: "Choose an option",
        choices: [
            "View all Departments",
            "View all Roles",
            "View all Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee Role",
            "Quit"
        ]
    }
];

const departmentPrompt = [
    {
        type: "input",
        name: "newDepartment",
        message: "Name of new department:"
    }
]

const rolePrompt = [
    {
        type: "input",
        name: "roleName",
        message: "Name of role:"
    },
    {
        type: "input",
        name: "salary",
        message: "Salary:"
    },
    {
        type: "input",
        name: "departmentName",
        message: "Department:"
    },
]

async function menu(){
    let continueLooping = true;
    while(continueLooping) {
        try {
            const responses = await inquirer.prompt(menuPrompt);
            switch (responses["menu"]) {
                case "View all Departments":
                    db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
                        console.table("\nDepartments", results);
                    });
                    break;
                case "View all Roles":
                    db.query("SELECT role.id AS id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
                        console.table("\nRoles", results);
                    });
                    break;
                case "View all Employees":
                    db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', title as 'Title', salary as Salary, name as Department, CONCAT(e.first_name, ' ', e.last_name) as Manager FROM employee JOIN role r on employee.role_id = r.id JOIN department d on d.id = r.department_id LEFT JOIN employee e on employee.manager_id = e.id", (err, results) => {
                        console.table("\nEmployees", results);
                    });
                    break;
                case "Add a Department":
                    const {newDepartment} = await inquirer.prompt(departmentPrompt);
                    db.query("INSERT INTO department (name) value (?)", newDepartment, (err) => {
                        err ? console.error(err) : true;
                    });
                    console.log(`Added department ${newDepartment}.`);
                    break;
                case "Add a Role":
                    const {roleName, salary, departmentName} = await inquirer.prompt(rolePrompt);
                    db.query("SELECT id FROM department WHERE name = ?", departmentName, (err, result)=>{
                        db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [roleName, salary, result[0].id], (err) => {
                            err ? console.error(err) : true;
                        });
                    });
                    console.log(`Added role ${roleName}.`);
                    break;
                case "Add an Employee":
                    // TODO: I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
                    break;
                case "Update an Employee Role":
                    // TODO: I am prompted to select an employee to update and their new role and this information is updated in the database
                    break;
                case "Quit":
                    continueLooping = false;
                    break;
            }
        } catch (err) {
            console.error(err);
        }
    }
    process.exit(0);
}

menu();

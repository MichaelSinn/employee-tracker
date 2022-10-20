const inquirer = require("inquirer");
const mysql = require("mysql2");
const qu = require("./queries");
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
        type: "list",
        name: "departmentId",
        message: "Department:",
        choices: []
    },
]

const employeePrompt = [
    {
        type: "input",
        name: "first_name",
        message: "First name:"
    },
    {
        type: "input",
        name: "last_name",
        message: "Last name:"
    },
    {
        type: "list",
        name: "role",
        message: "Role:",
        choices: []
    },
    {
        type: "list",
        name: "manager",
        message: "Manager name:",
        choices: []
    },
]

const updateEmployeePrompt = [
    {
        type: "list",
        name: "id",
        message: "Choose an employee:",
        choices: []
    },
    {
        type: "list",
        name: "role_id",
        message: "Choose a role:",
        choices: []
    }
]

async function menu(){
    let continueLooping = true;
    while(continueLooping) {
        try {
            const responses = await inquirer.prompt(menuPrompt);
            // const responses = {menu: "Add an Employee"};
            switch (responses["menu"]) {
                case "View all Departments": {
                    db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
                        console.table("\nDepartments", results);
                    });
                    break;
                }
                case "View all Roles": {
                    db.query("SELECT role.id AS id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
                        console.table("\nRoles", results);
                    });
                    break;
                }
                case "View all Employees": {
                    db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', title as 'Title', salary as Salary, name as Department, CONCAT(e.first_name, ' ', e.last_name) as Manager FROM employee JOIN role r on employee.role_id = r.id JOIN department d on d.id = r.department_id LEFT JOIN employee e on employee.manager_id = e.id", (err, results) => {
                        console.table("\nEmployees", results);
                    });
                    break;
                }
                case "Add a Department": {
                    const {newDepartment} = await inquirer.prompt(departmentPrompt);
                    db.query("INSERT INTO department (name) value (?)", newDepartment, (err) => {
                        err ? console.error(err) : true;
                    });
                    console.log(`Added department ${newDepartment}.`);
                    break;
                }
                case "Add a Role": {
                    const departments = await qu.getDepartments();
                    departments.forEach(department => {
                        rolePrompt[2].choices.push({name: department.name, value: department.id})
                    });
                    const {roleName, salary, departmentId} = await inquirer.prompt(rolePrompt);
                    db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [roleName, salary, departmentId], (err) => {
                        err ? console.error(err) : true;
                    });
                    console.log(`Added role ${roleName}.`);
                    break;
                }
                case "Add an Employee": {
                    const roles = await qu.getRoles();
                    roles.forEach(r => {
                        employeePrompt[2].choices.push({name: r.title, value: r.id});
                    });
                    const employees = await qu.getEmployeeNames();
                    employees.forEach(emp => {
                        employeePrompt[3].choices.push({name: emp.Name, value: emp.id});
                    });
                    const {first_name, last_name, role, manager} = await inquirer.prompt(employeePrompt);
                    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role, manager], (err, result) => {
                        err ? console.error(err) : true;
                    });
                    break;
                }
                case "Update an Employee Role": {// TODO: I am prompted to select an employee to update and their new role and this information is updated in the database
                    const employees = await qu.getEmployeeNames();
                    employees.forEach(emp =>{
                        updateEmployeePrompt[0].choices.push({name: emp.Name, value: emp.id});
                    });
                    const roles = await qu.getRoles();
                    roles.forEach(role =>{
                        updateEmployeePrompt[1].choices.push({name: role.title, value: role.id});
                    });
                    const {id, role_id} = await inquirer.prompt(updateEmployeePrompt);
                    db.query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, id], (err, result)=>{
                        err ? console.error(err) : true;
                    });
                    break;
                }
                case "Quit": {
                    continueLooping = false;
                    break;
                }
            }
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    }
    process.exit(0);
}

menu();

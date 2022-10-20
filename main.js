// Import required packages
const inquirer = require("inquirer");
const mysql = require("mysql2");
const qu = require("./queries");
require("console.table");
require("dotenv").config();

// Give database information it needs to connect
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    },
    console.log(`Connected to the ${process.env.DATABASE} database.`)
);

// Prompts for inquirer
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

// Prompts for adding a department
const departmentPrompt = [
    {
        type: "input",
        name: "newDepartment",
        message: "Name of new department:"
    }
]

// Prompts for adding a role
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

// Prompts for adding an employee
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

// Prompts for updating an employee
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

// Initialization function
async function init(){
    // Loop until the user exits
    let continueLooping = true;
    while(continueLooping) {
        try {
            // Get the user's choice from the menu
            const responses = await inquirer.prompt(menuPrompt);
            // Switch through the responses in menu
            switch (responses["menu"]) {
                // Displays all departments
                case "View all Departments": {
                    db.query("SELECT id, name as 'Department Name' FROM department", (err, results) => {
                        console.table("\nDepartments", results); // Display results in a table
                    });
                    break;
                }
                // Displays all roles
                case "View all Roles": {
                    db.query("SELECT role.id AS id, role.title as Title, role.salary as Salary, department.name as Department FROM role JOIN department on role.department_id = department.id", (err, results) => {
                        console.table("\nRoles", results); // Display results in a table
                    });
                    break;
                }
                // Displays all employees
                case "View all Employees": {
                    db.query("SELECT employee.id as id, employee.first_name as 'First Name', employee.last_name as 'Last Name', title as 'Title', salary as Salary, name as Department, CONCAT(e.first_name, ' ', e.last_name) as Manager FROM employee JOIN role r on employee.role_id = r.id JOIN department d on d.id = r.department_id LEFT JOIN employee e on employee.manager_id = e.id", (err, results) => {
                        console.table("\nEmployees", results); // Display results in a table
                    });
                    break;
                }
                // Adds a department
                case "Add a Department": {
                    const {newDepartment} = await inquirer.prompt(departmentPrompt); // Get the department name from the prompt
                    db.query("INSERT INTO department (name) value (?)", newDepartment, (err) => {
                        err ? console.error(err) : true; // Log any errors
                    });
                    console.log(`Added department ${newDepartment}.`);
                    break;
                }
                // Adds a role
                case "Add a Role": {
                    const departments = await qu.getDepartments(); // Wait for the departments to be retrieved
                    departments.forEach(department => {
                        rolePrompt[2].choices.push({name: department.name, value: department.id}); // Add the departments to the prompt
                    });
                    const {roleName, salary, departmentId} = await inquirer.prompt(rolePrompt); // Get the results from the rolePrompt
                    // Add the role to the database
                    db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);", [roleName, salary, departmentId], (err) => {
                        err ? console.error(err) : true; // Log any errors
                    });
                    console.log(`Added role ${roleName}.`);
                    break;
                }
                // Adds an employee
                case "Add an Employee": {
                    const roles = await qu.getRoles(); // Wait for the roles to be retrieved
                    roles.forEach(r => {
                        employeePrompt[2].choices.push({name: r.title, value: r.id}); // Add the roles to the prompt
                    });
                    const employees = await qu.getEmployeeNames(); // Wait for the employees to be retrieved
                    employees.forEach(emp => {
                        employeePrompt[3].choices.push({name: emp.Name, value: emp.id}); // Add the employees to the prompt
                    });
                    const {first_name, last_name, role, manager} = await inquirer.prompt(employeePrompt);
                    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [first_name, last_name, role, manager], (err) => {
                        err ? console.error(err) : true; // Log any errors
                    });
                    break;
                }
                // Updates an employee
                case "Update an Employee Role": {
                    const employees = await qu.getEmployeeNames(); // Wait for the employees to be retrieved
                    employees.forEach(emp =>{
                        updateEmployeePrompt[0].choices.push({name: emp.Name, value: emp.id}); // Add the employees to the prompt
                    });
                    const roles = await qu.getRoles(); // Wait for the roles to be retrieved
                    roles.forEach(role =>{
                        updateEmployeePrompt[1].choices.push({name: role.title, value: role.id}); // Add the roles to the prompt
                    });
                    const {id, role_id} = await inquirer.prompt(updateEmployeePrompt); // Get the results from the prompt
                    db.query("UPDATE employee SET role_id = ? WHERE id = ?", [role_id, id], (err)=>{
                        err ? console.error(err) : true;
                    });
                    break;
                }
                // Quits the loop
                case "Quit": {
                    continueLooping = false;
                    break;
                }
            }
        } catch (err) {
            console.error(`Error: ${err}`);
        }
    }
}

// Start the program
init().then(()=>{
    console.log("Goodbye!");
    process.exit(0);
});

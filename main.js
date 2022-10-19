const inquirer = require("inquirer");
const mysql = require("mysql2");

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
            "Update an Employee Role"
        ]
    }
];

async function menu(){
    try{
        const responses = await inquirer.prompt(menuPrompt);
        switch(responses["menu"]){
            case "View all Departments":
                // TODO: Display a formatted table showing department names and ids
                break;
            case "View all Roles":
                // TODO: Display job title, role id, the department that role belongs to, and the salary for that role
                break;
            case "View all Employees":
                // TODO: Display a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
                break;
            case "Add a Department":
                // TODO: I am prompted to enter the name of the department and that department is added to the database
                break;
            case "Add a Role":
                // TODO: I am prompted to enter the name, salary, and department for the role and that role is added to the database
                break;
            case "Add an Employee":
                // TODO: I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
                break;
            case "Update an Employee Role":
                // TODO: I am prompted to select an employee to update and their new role and this information is updated in the database
                break;
        }
    }catch(err){
        console.error(err);
    }
}
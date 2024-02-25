// imports here for express and pg
const express = require("express");
const app = express();
const path = require("path");
const pg = require("pg");

const client = new pg.Client(
    process.env.DATABASE_URL || "postgres://localhost/acme_hr_db"
);
// static routes here (you only need these for deployment)
app.get("/", (req, res) =>
    res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirname, "../client/dist")));

// app routes here
app.get("/api/employees", async (req, res, next) => {
    try {
        const SQL = `
        SELECT * FROM employees;
        `;

        const response = await client.query(SQL);
        res.send(response.rows);
    } catch (error) {
        next(ex);
    }
});
// create your init function
const init = async () => {
    await client.connect();

    const SQL = `
    DROP TABLE IF EXISTS employees;
    CREATE TABLE employees(
        ID SERIAL PRIMARY KEY,
        name VARCHAR(50),
        admin BOOLEAN DEFAULT FALSE
    );
    INSERT INTO employees(name,admin) VALUES('Mirage Baine', false);
    INSERT INTO employees(name,admin) VALUES('Steve De La Rosa', true);
    INSERT INTO employees(name,admin) VALUES('Pedro Santana', false);
    INSERT INTO employees(name,admin) VALUES('Wilfredo Maine', false);

    `;
    await client.query(SQL);
    console.log("data seeded");

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}`));
};

// init function invocation
init();

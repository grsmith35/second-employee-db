const express = require('express');
const db = require('../server');
const data = require('../data/data.json')
const app = express;
const mysql = require('mysql2');

app.get('/employees', (req, res) => {
    const sql = 'SELECT * FROM employees';

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


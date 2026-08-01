import Database from 'better-sqlite3';

console.log("Loading...");

const db = new Database(':memory:');

console.log("Success");

db.close();
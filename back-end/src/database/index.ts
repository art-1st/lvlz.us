import * as mysql from 'mysql';

export default new class Database {
    connection: mysql.Connection

    createConnection() {
        this.connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            // database: process.env.NODE_ENV === 'develop' ? process.env.DB_DATABASE + '_dev' : process.env.DB_DATABASE,
            database: process.env.DB_DATABASE,
            timezone: '+00:00'
        });
    }

    closeConnection() {
        this.connection.end();
    }

    query(sql) {
        return new Promise(async (resolve, reject) => {
            await this.createConnection();
            await this.connection.query(sql, (error, results, fields) => {
                if(error) return reject(error);
                resolve(results);
            });
            await this.closeConnection();
        });
    }
}
import mysql from 'mysql2/promise';

import { IHolidays } from './IHolidays.repository';

export class Holidays implements IHolidays {
    constructor(private _connection: mysql.Connection) {}

    findAll = async () => {
        const holidays = (await this._connection.query(
            'SELECT * FROM `holidays`'
        ))[0]
        return holidays
    }
}
import mysql from 'mysql2/promise';

import { IBasePrice } from './IBasePrice.repository';

export class BasePrice implements IBasePrice {
    constructor(private _connection: mysql.Connection) {}

    findByType = async (type: string) => (await this._connection.query(
        'SELECT cost FROM `base_price` ' +
        'WHERE `type` = ? ',
        [type]))[0][0];

    updateByType = async (type: string, cost: number) => {
        await this._connection.query(
            'INSERT INTO `base_price` (type, cost) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE cost = ?',
            [type, cost, cost])
    }
    
}
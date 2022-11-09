import express from 'express';
import mysql from 'mysql2/promise';

import { IPriceCalculator } from './calculator/IPriceCalculator';
import { PriceCalculator } from './calculator/PriceCalculator';
import { IPriceController } from './controllers/IPrice.controller';
import { PriceController } from './controllers/Price.controller';
import { BasePrice } from './repositories/basePrice/BasePrice.repository';
import { IBasePrice } from './repositories/basePrice/IBasePrice.repository';
import { Holidays } from './repositories/holidays/Holidays.repository';
import { IHolidays } from './repositories/holidays/IHolidays.repository';

const createApp = async () => {
    const app = express();

    const connectionOptions = { host: 'localhost', user: 'root', database: 'lift_pass', password: 'mysql', port: 3307 };
    const connection: mysql.Connection = await mysql.createConnection(connectionOptions);

    const basePriceRepo: IBasePrice = new BasePrice(connection);
    const holidaysRepo: IHolidays = new Holidays(connection);
    const priceCalculator: IPriceCalculator = new PriceCalculator(basePriceRepo, holidaysRepo);
    const priceController: IPriceController = new PriceController(priceCalculator, basePriceRepo);

    app.put('/prices', priceController.putPrice);
    app.get('/prices', priceController.getPrice);

    return { app, connection }
}

export { createApp }

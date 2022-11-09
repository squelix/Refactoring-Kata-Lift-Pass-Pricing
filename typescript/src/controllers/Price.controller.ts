import { IPriceCalculator } from '../calculator/IPriceCalculator';
import { IBasePrice } from '../repositories/basePrice/IBasePrice.repository';
import { IPriceController } from './IPrice.controller';

export class PriceController implements IPriceController {
    constructor(private _priceCalculator: IPriceCalculator, private _basePriceRepository: IBasePrice) {}

    putPrice = async (req, res) => {
        const cost = req.query.cost;
        const type = req.query.type;
        await this._basePriceRepository.updateByType(type, cost);
        res.json()
    };

    getPrice =  async (req, res) => {
        const type = req.query.type;
        const age = req.query.age;
        const date = req.query.date;
        const cost = await this._priceCalculator.calculate(type, age, date);
        res.json({cost})
    }
}
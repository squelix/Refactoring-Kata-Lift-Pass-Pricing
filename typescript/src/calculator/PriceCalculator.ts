import { IBasePrice } from '../repositories/basePrice/IBasePrice.repository';
import { IHolidays } from '../repositories/holidays/IHolidays.repository';
import { IPriceCalculator } from './IPriceCalculator';

export class PriceCalculator implements IPriceCalculator {
    private static FREE = 0;

    constructor(
        private _basePriceRepository: IBasePrice,
        private _holidaysRepository: IHolidays
    ) {}

    calculate = async (type: string,  age: number, date?: string): Promise<number> => {
        const baseCost = (await this._basePriceRepository.findByType(type)).cost;

        if (type === 'night') {
            return this.getNightPass(age, baseCost);
        }
            
        const reduction = await this.getReduction(date);
        return this.getDayPass(age, baseCost, reduction);
    }

    private getDayPass = (age: number, cost: number, reduction: number): number =>{
        if (age < 6) {
            return PriceCalculator.FREE;
        } 

        if (age < 15) {
            return this._reduceCostByPercentage(cost, 70);
        }
        
        if (age > 64) {
            return this._reduceCostByPercentage(this._reduceCostByPercentage(cost, 75), reduction);
        }

        return this._reduceCostByPercentage(cost, reduction);
    }

    private getNightPass = (age: number, cost: number): number => {
        if (age < 6) {
            return  PriceCalculator.FREE;
        }
        
        if (age > 64) {
            return this._reduceCostByPercentage(cost, 40);
        } 

        return cost
    }

    private getReduction = async (date?: string): Promise<number> => {
        const holidays = await this._holidaysRepository.findAll()
        const notAHoliday = !this.isAtHolidays(holidays, date);

        if (notAHoliday && date && new Date(date).getDay() === 1) {
            return 65;
        }

        return 100;
    }

    
    private isAtHolidays = (holidays: { holiday: Date }[], date?: string): boolean => {
        return holidays.some((row: {holiday: Date}) => {
            if(!date) {
                return false;
            }

            const holiday = row.holiday;
            const d = new Date(date);

            return d.getFullYear() === holiday.getFullYear()
                && d.getMonth() === holiday.getMonth()
                && d.getDate() === holiday.getDate()
        })
    }

    private _reduceCostByPercentage = (cost: number, percentOff: number): number => Math.ceil(cost * (percentOff / 100))
}
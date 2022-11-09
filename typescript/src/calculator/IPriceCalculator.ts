export interface IPriceCalculator {
    calculate: (type: string,  age: number, date?: string) => Promise<number>;
}
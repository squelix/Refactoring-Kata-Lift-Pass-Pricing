export interface IBasePrice {
    findByType: (type: string) => Promise<any>;
    updateByType: (type: string, cost: number) => Promise<any>;
    
}
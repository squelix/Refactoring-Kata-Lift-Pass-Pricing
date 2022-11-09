export interface IPriceController {
    putPrice: (req, res) => Promise<void>;
    getPrice: (req, res) => Promise<void>;

}
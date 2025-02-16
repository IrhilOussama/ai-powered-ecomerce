import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();
const {SIMILARITIES_FILE} = process.env;

describe('Similarities Data', () => {
    let similaritiesData;

    beforeAll(() => {
        const rawData = fs.readFileSync(SIMILARITIES_FILE);
        similaritiesData = JSON.parse(rawData);
    });

    test('should be an array', () => {
        expect(Array.isArray(similaritiesData)).toBe(true);
    });

    // test('each item should have required properties', () => {
    //     similaritiesData.forEach(item => {
    //         expect(item).toHaveProperty('id');
    //         expect(item).toHaveProperty('similarProducts');
    //         expect(Array.isArray(item.similarProducts)).toBe(true);
    //     });
    // });

    // test('each similar product should have required properties', () => {
    //     similaritiesData.forEach(item => {
    //         item.similarProducts.forEach(similarProduct => {
    //             expect(similarProduct).toHaveProperty('id');
    //             expect(similarProduct).toHaveProperty('score');
    //             expect(typeof similarProduct.id).toBe('string');
    //             expect(typeof similarProduct.score).toBe('number');
    //         });
    //     });
    // });

    test('eatch image has to be associated with a product', () => {
        similaritiesData.forEach(item => {
            item.similarProducts.forEach(similarProduct => {
                
            });
        });
    });

});
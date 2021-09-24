const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 8000;

const CATEGORY_URL = 'https://tiendamia.com/pe/categorias?amzc=enteritos-dama';

async function getProduct(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(`CATEGORIA: ${CATEGORY_URL}`)
    await page.goto(CATEGORY_URL);
    await page.waitForSelector('.retailrocket-items .retailrocket-item');
    const items = await page.$$eval('.retailrocket-item .cart-wrapper', (products) => {
        return products.map((el) => el.querySelector('.item-info').href);
    });
    console.log(`PRODUCTO: ${items[0]}`);
    await page.goto(items[0]);
    await page.waitForSelector('#color_name_configurable_producto_ajax');
    const selectedOption = await page.$eval('#size_name_configurable_producto_ajax', (e) => e.value);
    const options = await page.$$eval('#size_name_configurable_producto_ajax option', (el) => {
        return el.map((e) => e.value).filter((v) => v);
    });
    console.log(`TALLA: ${selectedOption}`);
    console.log(`OTRAS TALLAS: ${options}`);

    await browser.close();
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    getProduct(CATEGORY_URL);
    res.json({ status: 'OK' });      
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`); 
});

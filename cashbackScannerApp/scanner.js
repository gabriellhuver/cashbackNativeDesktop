const util = require('./util')
const crawler = require('./crawler')
var urls = []
var products = []
var productsMetada = []
var cashbacks = []
var lastUrl

var settings = {
    PAGE_RANGE: 10,
    ORDENATION: 'relevance',
    CASHBACK_VALUE: 20
}

async function init() {
    await loadDatabase();
    for (let index = 0; index < urls.length; index++) {
        const url = urls[index];
        await findProducts(url.url);
        await scanProductsMetadata();
    }
}

init()


async function loadDatabase() {
    return new Promise(async function (resolve, reject) {
        settings = await util.loadJson('settings.json');
        urls = await util.loadJson('urls.json');
        productsMetada = await util.loadJson('productsMetadata.json');
        cashbacks = await util.loadJson('cashbacks.json');
        util.showInfo({
            msg: JSON.stringify(settings),
            data: settings
        });
        util.showInfo({
            msg: 'Loading data...',
            data: null
        });
        util.showInfo({
            msg: JSON.stringify(urls),
            data: urls
        })

        resolve()
    })
}

async function scanProductsMetadata() {
    return new Promise(async function (resolve, reject) {
        try {
            for (let index = 0; index < products.length; index++) {
                const productUrl = products[index];
                let productMetada = await crawler.getProductDataFromUrl(productUrl);
                process.send({
                    msg: 'product found ' + JSON.stringify(productMetada),
                    data: productMetada
                });
                if (productMetada.cashback >= settings.CASHBACK_VALUE) {
                    cashbacks.push(productMetada)
                    await util.saveToJson('cashbacks.json', util.getUnique(cashbacks, 'name'))
                    process.send({
                        msg: 'cashback localized ' + JSON.stringify(productMetada),
                        data: productMetada
                    })
                }
                if (!productsMetada.includes(productMetada)) {
                    productsMetada.push(productMetada);
                    await util.saveToJson('productsMetadata.json', util.getUnique(productsMetada, 'name'))
                }
            }
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

async function findProducts(url) {
    return new Promise(async function (resolve, reject) {
        try {
            products = []

            await getBestProductsFromUrl(url);
            process.send({
                msg: products.length + ' Products found on ' + url,
                data: null
            });
            lastUrl = url
            resolve()
        } catch (error) {
            reject(error)
        }
    })

}

async function getBestProductsFromUrl(url) {
    return new Promise(async function (resolve, reject) {
        try {
            if (url.includes('/categoria/')) {
                for (let index = 1; index < settings.PAGE_RANGE; index++) {
                    let mountedUrl = url + '?limite=24&offset=' + (index * 24) + '?ordenacao=' + settings.ORDENATION
                    util.showInfo({
                        msg: 'finding products on ' + mountedUrl,
                        data: null
                    })
                    await crawler.getProductsFromUrl(mountedUrl, products)
                }
                resolve()
            } else {
                for (let index = 1; index < settings.PAGE_RANGE; index++) {
                    let mountedUrl = url + '/pagina-' + index + '?ordenacao=' + settings.ORDENATION
                    util.showInfo({
                        msg: 'finding products on ' + mountedUrl,
                        data: null
                    })
                    await crawler.getProductsFromUrl(mountedUrl, products)
                }
                resolve()
            }


        } catch (error) {
            process.send({
                msg: 'Erro on url finding products  ' + url,
                data: url
            })
        }
    })
}
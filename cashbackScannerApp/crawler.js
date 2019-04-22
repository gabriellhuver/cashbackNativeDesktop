const request = require('request')
const cheerio = require('cheerio')
const psl = require('psl');
var mainUri = 'https://www.americanas.com.br'


async function getProductsFromUrl(url, products) {
    return new Promise(function (resolve, reject) {
        let retData = []
        request({
            url: url,
            method: 'GET',
            followAllRedirects: true,
        }, function (error, response, body) {
            if (error) reject(error)
            //console.log('statusCode: ', response && response.statusCode); // Print the response status code if a response was received
            try {
                let html = cheerio.load(body)
                mainUri = "https://" + psl.get(extractHostname(url));
                html('a').each(function (index, elem) {
                    let url = html(elem).attr('href')
                    try {
                        if (url.includes('/produto/')) {
                            if (!products.includes(mainUri.concat(url))) {
                                products.push(mainUri.concat(url))
                            }
                        }
                    } catch (error) {}
                })
                resolve(retData)
            } catch (error) {
                reject(error)
            }
        });
    })
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
}

async function getProductDataFromUrl(url) {
    return new Promise(function (resolve, reject) {
        request({
            url: url,
            method: 'GET',
            followAllRedirects: true,
        }, function (error, response, body) {
            if (error) reject(error)
            var html = cheerio.load(body)
            let cod
            html('span').each(function (index, element) {
                if (html(element).text().includes('(Cód.')) {
                    cod = html(element).text().replace('(Cód.', '').replace(')', '')
                }
            })
            let name = html('#product-name-default').text()
            let cashback = 0
            let price = 0
            html('script').each(function (index, element) {
                if (html(element).html().includes('cashback')) {
                    try {
                        let jsonData = extractJSON(html(element)
                            .html())[0].entities.offers[cod]
                        jsonData.forEach(data => {
                            let t = data.paymentOptions.BPAY.cashback.rate
                            if (t >= cashback) {
                                cashback = t
                                price = data.paymentOptions.BPAY.price
                            }
                        });
                    } catch (error) {

                    }
                    //console.log(extractJSON(html(element).html()))
                    //resolve(jsonData)
                }
            })
            let prodData = {
                url: url,
                name: name,
                price: price,
                cod: cod,
                cashback: cashback
            }
            resolve(prodData)

        })

    })
}

function extractJSON(str) {
    var firstOpen, firstClose, candidate;
    firstOpen = str.indexOf('{', firstOpen + 1);
    do {
        firstClose = str.lastIndexOf('}');
        //console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
        if (firstClose <= firstOpen) {
            return null;
        }
        do {
            candidate = str.substring(firstOpen, firstClose + 1);
            //console.log('candidate: ' + candidate);
            try {
                var res = JSON.parse(candidate);
                //console.log('...found');
                return [res, firstOpen, firstClose + 1];
            } catch (e) {
                //console.log('...failed');
            }
            firstClose = str.substr(0, firstClose).lastIndexOf('}');
        } while (firstClose > firstOpen);
        firstOpen = str.indexOf('{', firstOpen + 1);
    } while (firstOpen != -1);
}

module.exports = {
    getProductDataFromUrl,
    getProductsFromUrl,
}
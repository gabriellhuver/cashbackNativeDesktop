const request = require('request')
const cheerio = require('cheerio')
let psl = require('psl');
var mainUri = 'https://www.americanas.com.br'


async function getProductsFromUrl(url, products) {
    return new Promise(function (resolve, reject) {
        let retData = []
        // faz o request na pagina
        request({
            url: url,
            method: 'GET',
            followAllRedirects: true,
        }, function (error, response, body) {
            if (error) reject(error)
            try {
                // carrega a pagina pra uma variavel
                let html = cheerio.load(body)
                // pega o hostname da url
                mainUri = "https://" + psl.get(extractHostname(url));
                // pega todas as tags de link da pagina
                html('a').each(function (index, elem) {
                    let url = html(elem).attr('href')
                    try {
                        // pagina que conter /produto/ é uma pagina de produto
                        if (url.includes('/produto/')) {
                            if (!products.includes(mainUri.concat(url))) {
                                // o link vem "/produto/example" da pagina
                                // ai ele joga pra lista a url que foi extraida no começo + "/produto/example"
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


async function getProductDataFromUrl(url) {
    return new Promise(function (resolve, reject) {
        // faz o request na pagina do produtos
        request({
            url: url,
            method: 'GET',
            followAllRedirects: true,
        }, function (error, response, body) {
            if (error) reject(error)
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            // Carrega a pagina pra variavel html
            var html = cheerio.load(body)
            let cod
            // Localiza o codigo do produto
            html('span').each(function (index, element) {
                if (html(element).text().includes('(Cód.')) {
                    cod = html(element).text().replace('(Cód.', '').replace(')', '')
                }
            })
            // Localiza o nome
            let name = html('#product-name-default').text()
            let cashback = 0
            let price = 0
            // Pega todos os script/json da pagina
            html('script').each(function (index, element) {
                // Acha o json que contem as informações do produto
                if (html(element).html().includes('cashback')) {
                    try {
                        // pega as ofertas que existem no produto
                        //(Pode existir ofertas no JSON que não existem na página. Ainda não entendi poque)
                        let offers = extractJSON(html(element)
                            .html())[0].entities.offers[cod]
                        // Faz o loop em todas as ofertas e pega a quem tem o cashback rate maior
                        offers.forEach(data => {
                            // Pega o cashback rate das ofertas e ve qual é a maior
                            let cashbakRate = data.paymentOptions.BPAY.cashback.rate
                            if (cashbakRate > cashback) {
                                cashback = cashbakRate
                                price = data.paymentOptions.BPAY.price
                            }
                        });
                    } catch (error) {

                    }
                }
            })
            // retorna todos os dados
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

function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
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
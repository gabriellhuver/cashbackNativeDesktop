const crawler = require('./crawler')
const util = require('./util')
const fs = require('fs')
const productExampleUrl = 'https://www.shoptime.com.br/produto/34224922?pfm_carac=LOJA%20BELGRADO.&pfm_index=0&pfm_page=seller&pfm_pos=grid&pfm_type=vit_product_grid&sellerId=27173989000191'
const sellerExample = 'https://www.americanas.com.br/lojista/loja-iplace'


async function foo() {
    let data = await crawler.getProductDataFromUrl(productExampleUrl)
    //let data = await crawler.getProductsFromUrl(sellerExample)
    //util.saveToJson('urls.json', ['https://www.americanas.com.br/lojista/loja-iplace'])
    console.log(data)

}


function extractJSON(str) {
    var firstOpen, firstClose, candidate;
    firstOpen = str.indexOf('{', firstOpen + 1);
    do {
        firstClose = str.lastIndexOf('}');
        console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
        if (firstClose <= firstOpen) {
            return null;
        }
        do {
            candidate = str.substring(firstOpen, firstClose + 1);
            console.log('candidate: ' + candidate);
            try {
                var res = JSON.parse(candidate);
                console.log('...found');
                return [res, firstOpen, firstClose + 1];
            } catch (e) {
                console.log('...failed');
            }
            firstClose = str.substr(0, firstClose).lastIndexOf('}');
        } while (firstClose > firstOpen);
        firstOpen = str.indexOf('{', firstOpen + 1);
    } while (firstOpen != -1);
}
//foo()

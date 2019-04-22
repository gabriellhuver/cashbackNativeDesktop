const fs = require('fs')

function showInfo(info) {

   process.send(info)
}


function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function showErro(erro) {
   process.send(erro)
}
async function loadJson(file) {
    return new Promise(function (resolve, reject) {
        fs.readFile('./cashbackScannerApp/database/' + file, 'utf8', async function readFileCallback(err, data) {
            if (err) {
                console.log(err);
                if (err.message.includes('no such file')) {
                    await saveToJson(file, [])
                    resolve(await loadJson(file))
                }
            } else {
                try {
                    resolve(JSON.parse(data))
                } catch (error) {
                    reject(error)
                }
            }
        });
    })
}

async function saveToJson(file, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile('./cashbackScannerApp/database/' + file, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                reject(err)

            }
            resolve()
        });
    })
}

function getUnique(arr, comp) {

    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}
module.exports = {
    showInfo,
    showErro,
    getRandomArbitrary,
    loadJson,
    saveToJson,
    getUnique
}
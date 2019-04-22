const fs = require('fs')
export async function getUrlsFromDatabase() {
    return new Promise(function (resolve, reject) {
        try {
            fs.readFile('./cashbackScannerApp/database/urls.json', 'utf8', async function readFileCallback(err, data) {
                if (err) {
                    console.log(err);

                } else {
                    try {
                        resolve(JSON.parse(data))
                    } catch (error) {
                        reject(error)
                    }
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}
export async function getAllProducts() {
    return new Promise(function (resolve, reject) {
        try {
            fs.readFile('./cashbackScannerApp/database/productsMetadata.json', 'utf8', async function readFileCallback(err, data) {
                if (err) {
                    console.log(err);

                } else {
                    try {
                        resolve(JSON.parse(data))
                    } catch (error) {
                        reject(error)
                    }
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}
export async function getAllCashbacks() {
    return new Promise(function (resolve, reject) {
        try {
            fs.readFile('./cashbackScannerApp/database/cashbacks.json', 'utf8', async function readFileCallback(err, data) {
                if (err) {
                    console.log(err);

                } else {
                    try {
                        resolve(JSON.parse(data))
                    } catch (error) {
                        reject(error)
                    }
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}
export async function loadJson(file) {
    return new Promise(function (resolve, reject) {
        try {
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
        } catch (error) {
            reject(error)
        }
    })
}
export async function saveToJson(file, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile('./cashbackScannerApp/database/' + file, JSON.stringify(data), 'utf8', (err) => {
            if (err) {
                reject(err)

            }
            resolve()
        });
    })
}
export default {
    saveToJson,
    getUrlsFromDatabase
}
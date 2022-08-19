import axios from 'axios';
import express from "express"; // 加入這行

const app = express(); // 加入這行

const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.com/v3.1/currency/${currencyCode}`);
        return response.data.map(country => country.name.common);
    } catch (error) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
};

const convertCurrency = async (fromCurrency, toCurrency, amount) => {
    const countries = await getCountries(toCurrency);
    const convertedAmount = (amount * Math.random() * 11).toFixed(2);

    return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spend these in the following countries: ${countries}`;
};

// 建立 end-point - 加入此片段
app.get('/', async (req, res) => {
    const { fromCurrency, toCurrency, amount } = req.query; // destructure 解構
    if (!fromCurrency || !toCurrency || !amount) {
        res.send({"message": "Please provide all the required parameters!"})
    } else {
        const message = await convertCurrency(fromCurrency, toCurrency, amount)
        // res.send(message)
        res.json({message}) // 轉換成 json
    }
})

// express 啟動服務 - 加入此片段
app.listen((process.env.PORT || 5000), () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})

// 本地端 - node index.js 會執行下列片段
// convertCurrency('USD', 'CHF', 20)
//     .then((data) => { 
//         console.log(data);
//      })
//     .catch((error) => { 
//         console.log(error);
//     });
const express = require('express');
const axios = require('axios');
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const cheerio = require('cheerio');

// Create an instance of Express
const app = express();

// Enable cookie jar support
const client = wrapper(axios);

// Create a cookie jar to store cookies
const cookieJar = new tough.CookieJar();

// Add cookies to the jar (as you've defined earlier)
cookieJar.setCookieSync('wordpress_sec_0d67094e56c7d821f275744c0584a16f=admin%7C1724525373%7CdMh3MwTlmw6I3J7g93V6zbSQmBnib6CHThMhOu9kEPL%7Caf4c916edcc307978b105159f2a69d6b3922ec43ca35aa1d79a3394371298f9d; Path=/; Domain=mlobd.online', 'https://mlobd.online');
cookieJar.setCookieSync('wp-settings-time-1=1723315773; Path=/; Domain=mlobd.online', 'https://mlobd.online');

// Define the request headers (as you've defined earlier)
const headers = {
    'authority': 'mlobd.online',
    'method': 'POST',
    'path': '/wp-admin/admin.php?page=Droplink',
    'scheme': 'https',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'origin': 'https://mlobd.online',
    'priority': 'u=0, i',
    'referer': 'https://mlobd.online/wp-admin/admin.php?page=Droplink',
    'sec-ch-ua': '"Not)A;Brand";v="99", "Microsoft Edge";v="127", "Chromium";v="127"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'content-type': 'application/x-www-form-urlencoded',
};

// Route to handle the incoming request
app.get('/', async (req, res) => {
    // Get the link from the query parameter
    const link = req.query.link;

    // Ensure the link is provided
    if (!link) {
        return res.status(400).send('Link parameter is required');
    }

    // Encode the link and replace it in the body
    const encodedLink = encodeURIComponent(link);
    const body = `linkd=${encodedLink}&generate=Generate`;

    try {
        // Send the POST request
        const response = await client.post('https://mlobd.online/wp-admin/admin.php?page=Droplink', body, {
            headers: headers,
            jar: cookieJar, // Use the cookie jar
            withCredentials: true // Send cookies with the request
        });

        // Load the HTML into cheerio for parsing
        const $ = cheerio.load(response.data);

        // Extract the content using the specified selector
        const extractedElement = $('#generate > div > form > table > tbody > tr:nth-child(2) > td > p:nth-child(2) > code:nth-child(1) > a').text();

        // Send the extracted content back to the client
        if (extractedElement) {
            res.send(extractedElement);
        } else {
            res.status(404).send('Element not found');
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing the request');
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

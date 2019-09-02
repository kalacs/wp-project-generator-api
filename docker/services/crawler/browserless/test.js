const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const SITE_TITLE = 'kalacs';
const USER_NAME = 'kalacs';
const USER_PASSWORD = 'kalacs';
const USER_EMAIL = 'kalacs@gmail.com';

app.get('/image', async (req, res) => {
    // This was puppeteer.launch()
    const browser = await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:3000' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('http://webserver:80/');
    // select language
    await page.select('select#language', 'hu_HU');
    await Promise.all([
        page.waitForNavigation(),
        page.click('#language-continue'),
      ]);
    // step 1
    await page.type('#weblog_title', SITE_TITLE);
    await page.type('#user_login', USER_NAME);
    await page.evaluate( () => document.getElementById("pass1-text").value = "")
    await page.type('#pass1-text', USER_PASSWORD);
    await page.click('input[name=pw_weak]'),
    await page.type('#admin_email', USER_EMAIL);
    await Promise.all([
        page.waitForNavigation(),
        page.click('#submit'),
      ]);

    const screenshot = await page.screenshot({type: 'jpeg'});

    return res.end(screenshot, 'binary');
});

app.listen(8080);

const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

app.use(express.json())


app.get('/', function (req, res) {
    res.json('This is my webscraper')
})


app.post('/detail', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({dataku:"ini data aja sih"}));
})

// find course
app.get('/course/:key', (req, res) => {
    const url = 'https://buildwithangga.com/search?keyword=' + req.params.key;

    const articles = [];

    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            console.log(html);

            $('.course-card', html).each(function () { //<-- cannot be a function expression
                const title = $(this).find('div.course-name').text().trim()
                const url = $(this).find('a').attr('href');
                const harga = $(this).find('span.origin-price').text().trim();
                const image = $(this).find('img').attr('src');
                articles.push({
                    title, url, image, harga
                })
            })
            res.json(articles)
        }).catch(err => console.log(err))

})

app.get('/seminar/:key', (req, res) => {
    const url = 'https://ngampooz.com/event/read?page=1';
    // const url = 'https://jadwalevent.web.id/?s=teknologi';

    const articles = [];

    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            console.log(html);

            $('.per-card', html).each(function () { 
                const title = $(this).find('div.title a h6').text().trim();
                const url = $(this).find('div.title a').attr('href');
                const image = $(this).find('div.card a img.card-bg').attr('src');
                articles.push({
                    title, url, image
                })
            })
            res.json(articles)
        }).catch(err => console.log(err))

})

app.get('/jobseeker/:key', (req, res) => {
    const url = 'https://www.linkedin.com/jobs/search/?keywords='+req.params.key+'&location=Indonesia&position=1&pageNum=0';

    const articles = [];

    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            
            $('div.base-search-card', html).each(function () { //<-- cannot be a function expression
                // const title = $(this).text()
                const job = $(this).find('div.base-search-card__info h3.base-search-card__title').text().trim()
                const company = $(this).find('h4.base-search-card__subtitle a.hidden-nested-link').text().trim();
                const location = $(this).find('div.base-search-card__metadata span.job-search-card__location').text().trim();
                const logo = $(this).find('.artdeco-entity-image').attr('data-delayed-url');
                const detail = $(this).find('a.base-card__full-link').attr('href');
                articles.push({
                    job, company, location, logo, detail
                })
            })
            res.json(articles)
        }).catch(err => console.log('ada error', err))

})


app.get('/lokerid/:key', (req, res) => {
    const url = 'https://www.loker.id/cari-lowongan-kerja?q='+req.params.key+'&lokasi=0';

    const articles = [];

    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            
            $('.job-box', html).each(function () { //<-- cannot be a function expression
                // const title = $(this).text()
                const job = $(this).find('h3.media-heading a').text().trim();
                const company = $(this).find('table tbody tr:nth-child(1) td:nth-child(2)').text().trim();
                // const location = $(this).find('div.base-search-card__metadata span.job-search-card__location').text().trim();
                const logo = $(this).find('img.avatar').attr('data-lazy-srcset').slice(0, -2).trim();
                const detail = $(this).find('h3.media-heading a').attr('href');
                articles.push({
                   job,company, logo, detail
                })
            })
            res.json(articles)
        }).catch(err => console.log('ada error', err))

})

app.get('/kalibrr/:key', (req, res) => {
    const url = 'https://www.kalibrr.com/id-ID/job-board/te/'+req.params.key+'/1';

    const articles = [];

    axios(url)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            
            $('.k-divide-y .k-border-tertiary-ghost-color', html).each(function () { //<-- cannot be a function expression
                // const title = $(this).text()
                const job = $(this).find('a.k-text-primary-color:nth-child(1)');
                const company = $(this).find('a.k-bg-white div.k-col-start-3 a.k-text-subdued').text().trim();
                const ss = $(this).find('span.k-text-subdued').text().trim();
                const logo = $(this).find('a.k-text-subdued img').attr('src');
                // const detail = $(this).find('a.k-text').attr('href');
                // articles.push({
                //    job, company, ss, logo
                // })
            })
            res.json(articles)
        }).catch(err => console.log('ada error', err))

})



// ========= Get Detail  ===========

app.post('/course-detail', function (req, res) {
    
    const url = req.body.data;
    console.log(url);
    
    axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)

        
        const dataScrape = [];
        $('.container', html).each(function () { //<-- cannot be a function expression
            const title = $(this).find('h1.header-primary').text().trim();
            const price = $(this).find('.item-pricing h2.title').text().trim();
            const about = $(this).find('.tabs-content-nd #pills-home .col-lg-7:nth-child(1)').html();
            
            dataScrape.push({
            title, price, about
            })
        })
        res.json(dataScrape);
    }).catch(err => console.log('err'))      
})



app.post('/seminar-detail', function (req, res) {
    
    const url = req.body.data.replace(/"/g, '');
    
    axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        
        
        const dataScrape = [];
        $('#main-event', html).each(function () {
            const price = $(this).find('.event-price').text().trim();
            const description = $(this).find('.under').html();
            dataScrape.push({
            price,description
            })
        })
        res.json(dataScrape);
    }).catch(err => console.log('err'))      
})



app.post('/jobseeker-detail', function (req, res) {
    
    const url = req.body.data.replace(/"/g, '');
    
    axios(url)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        
        
        const dataScrape = [];
        $('.core-section-container__content', html).each(function () {
            const title = $(this).find('.show-more-less-html div').html();
            const jobType = $(this).find('ul.description__job-criteria-list li:nth-child(2) span').text().trim();
            dataScrape.push({
            title,jobType
            })
        })
        res.json(dataScrape);
    }).catch(err => console.log('err'))      
})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
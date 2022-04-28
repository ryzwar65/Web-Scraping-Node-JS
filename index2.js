const request = require('request')
const cheerio = require('cheerio')

var keyword = "macbook pro 2015"

setTimeout(() => {
  request(`https://www.tokopedia.com/search?q=${keyword}&source=universe&srp_component_id=02.07.02.01&st=product`,(error,response,html)=>{
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html)
    const select = $(".css-12sieg3")
    
    console.log(select.length)
    select.each((i,el)=>{
      console.log($(el).find('.css-974ipl').children().attr('href'))
    })
    // const test = $('.css-974ipl')
    // var coba = []
    // test.each((i,el)=>{
      //   // console.table($(el).children().attr('href'))
      //   coba.push($(el).children().attr('title'))
      // })    
      // console.log(coba.length)
    }
  })
}, 10000);
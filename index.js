const puppeteer = require('puppeteer')
const fs = require('fs');

function extractItems() {
  const extractedElements = document.querySelectorAll('.css-12sieg3 > .css-y5gcsw > .css-5fmc3z > .css-qa82pd > .css-1c4umxf > .css-gfx8z3 > .css-1f2quy8 > a');
  const items = [];
  for (let element of extractedElements) {
    items.push(element.getAttribute("href"));
  }
  return items;
}

async function scrapeInfiniteScroll(
  page,
  extractItems,
  itemTargetCount,
  scrollDelay = 1000,
) {
  let items = [];
  try {
    let previousHeight;
    while (items.length < itemTargetCount) {
      items = await page.evaluate(extractItems);
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { }
  page.close();
  return items;
}


(async ()=>{
  const browser = await puppeteer.launch({
    headless:false,
    args: ['--no-sandbox','--disable-setuid-sandbox'],
  });  
  const page = await browser.newPage()
  
  page.setViewport({ width: 1280, height: 926 });

  var keyword = "macbook pro 2015"

  await page.goto(`https://www.tokopedia.com/search?q=${keyword}&source=universe&srp_component_id=02.07.02.01&st=product`)

  const items = await scrapeInfiniteScroll(page, extractItems, 100)

  // Save extracted items to a file.
  fs.writeFileSync('./items.txt', items.join('\n') + '\n');

  // Close the browser.
  await browser.close();

})()
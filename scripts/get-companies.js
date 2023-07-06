/**
 * This script will download a list of S&P 500 companies and
 * write them to a file for further processing.
 */

const fs = require('fs');
const cheerio = require('cheerio');

const getCompanies = async (wikiUrl) => {
  const res = await fetch(wikiUrl);
  if (res.status !== 200) {
    console.error('Error fetching wiki page.');
    return null;
  }
  const rawText = await res.text();
  const $ = cheerio.load(rawText);

  const companyResults = [];

  const rows = $('#constituents > tbody').find('tr');
  for (var i = 0; i < rows.length; i++) {
    const current = rows[i];
    const stockSymbol = $(current).children('td:nth-child(1)').text().trim();
    if (stockSymbol === '') {
      continue;
    }
    const companyEl = $(current).children('td:nth-child(2)');
    const companyName = companyEl.text().trim();
    const companyUrl = $(companyEl).children('a')[0].attribs['href'];

    companyResults.push({
      symbol: stockSymbol,
      name: companyName,
      imageName: `${stockSymbol}.png`,
      // Some of the companies don't have wikipedia pages.
      url: companyUrl.includes('index.php')
        ? '-'
        : `https://en.wikipedia.org${companyUrl}`,
    });
  }

  console.log(`Found ${companyResults.length} companies`);

  return companyResults;
};

const SP500_URL = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies';
const COMPANIES_JSON_PATH = './db/seeders/companies.json';

const go = async () => {
  const companies = await getCompanies(SP500_URL);

  fs.writeFileSync(
    COMPANIES_JSON_PATH,
    JSON.stringify(companies, null, 2),
    'utf-8',
  );

  console.log('File written successfully to:', COMPANIES_JSON_PATH);
};

go();

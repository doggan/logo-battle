const fs = require('fs');
const cheerio = require('cheerio');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
const { fail } = require('assert');

const getImageUrl = async (wikiUrl, stockSymbol) => {
  const res = await fetch(wikiUrl);
  if (res.status !== 200) {
    console.error(`Error fetching wiki page: \`${stockSymbol}`);
    return null;
  }
  const rawText = await res.text();
  const $ = cheerio.load(rawText);
  const imgParent = $('.infobox-image,.logo');
  if (!imgParent) {
    console.error(`Error parsing html for logo: \`${stockSymbol}`);
    return null;
  }
  const imgEls = imgParent.find('img');
  if (!imgEls || imgEls.length === 0) {
    console.error(`Error parsing html - unable to find img: \`${stockSymbol}`);
    return null;
  }
  const imgEl = imgEls[0];
  const imgSrc = imgEl.attribs['src'];
  return `https:${imgSrc}`;
};

const downloadLogo = async (imageUrl, outFileName) => {
  const res = await fetch(imageUrl);
  if (res.status !== 200) {
    console.error(`Error downloading image: \`${imageUrl}`);
    return null;
  }
  const fileStream = fs.createWriteStream(outFileName, { flags: 'w' });
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
};

const COMPANIES_JSON_PATH = './db/seeders/companies.json';
const LOGO_OUT_DIR = './public/logos';

const go = async () => {
  const companies = JSON.parse(
    fs.readFileSync(COMPANIES_JSON_PATH, {
      encoding: 'utf8',
      flag: 'r',
    }),
  );

  console.log(`Loaded ${companies.length} companies.`);

  const failedCompanies = [];

  for (let i = 0; i < companies.length; i++) {
    const company = companies[i];

    const wikiUrl = company['url'];
    const symbol = company['symbol'];
    const outPath = `${LOGO_OUT_DIR}/${company['imageName']}`;

    // Skip if exists to avoid re-download.
    if (fs.existsSync(outPath)) {
      console.log(`Skipping logo for ${symbol}. File already exists.`);
      continue;
    }

    // Some companies don't have wiki URLs. We'll have to manually download these logos.
    // Most (all?) can be found here: https://companieslogo.com/
    if (wikiUrl.length === 0) {
      console.log(`Skipping ${symbol} - no wiki url.`);
      failedCompanies.push(company);
      continue;
    }

    const imageUrl = await getImageUrl(wikiUrl, symbol);
    if (!imageUrl) {
      failedCompanies.push(company);
      continue;
    }

    await downloadLogo(imageUrl, outPath);

    console.log(`Downloaded logo for ${symbol} to ${outPath}`);
  }

  console.log(
    `Successfully downloaded ${
      companies.length - failedCompanies.length
    } logos.`,
  );

  if (failedCompanies.length > 0) {
    console.log(`Failed to download ${failedCompanies.length} logos:`);
    console.log(failedCompanies.map((c) => c['symbol']).join(','));
  }
};

go();

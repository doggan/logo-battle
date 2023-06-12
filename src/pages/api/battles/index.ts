import type { NextApiRequest, NextApiResponse } from 'next';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

async function getBattle(req: NextApiRequest, res: NextApiResponse) {
  // TODO:randomly get 2 companies from the DB (different ones) and return them
  // https://stackoverflow.com/questions/2824157/how-can-i-get-a-random-record-from-mongodb

  await new Promise((r) => setTimeout(r, 2000));

  if (getRandomInt(2) === 0) {
    console.log('### get battle return');
    res.status(200).json({
      company1: {
        id: '6484bfe2053e1512c97c1cf8',
        name: 'Apple Inc',
        imageName: 'apple.png',
        symbol: 'AAPL',
      },
      company2: {
        id: '6484bfe2053e1512c97c1cf9',
        name: 'Microsoft Corp',
        imageName: 'microsoft.png',
        symbol: 'MSFT',
      },
    });
  } else {
    res.status(200).json({
      company1: {
        id: '6484bfe2053e1512c97c1cf9',
        name: 'Microsoft Corp',
        imageName: 'microsoft.png',
        symbol: 'MSFT',
      },
      company2: {
        id: '6484bfe2053e1512c97c1cf8',
        name: 'Apple Inc',
        imageName: 'apple.png',
        symbol: 'AAPL',
      },
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  // res: NextApiResponse<Vote | Error>,
  // TODO: type safety??
  res: NextApiResponse,
) {
  const { method } = req;

  if (method === 'GET') {
    return getBattle(req, res);
  } else {
    return res.status(422).send({ error: 'Invalid request: expected GET.' });
  }
}

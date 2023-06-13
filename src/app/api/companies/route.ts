import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { Company, toCompany } from '@/app/api/battles/route';
import { NextApiRequest } from 'next';
import { Request } from 'next/dist/compiled/@edge-runtime/primitives/fetch';

type ResponseData = {
  companies: Company[];
};

type Error = {
  error: string;
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ResponseData | Error>> {
  // TODO:
  // - paginate (limit, offset)... if we sort in code, we need to handle this.
  //    if we want to do it on the db layer, we'll need to store win % in the document.
  // - take a sort parameter (win %)

  // console.log('### query: ', req.url);

  // const { searchParams } = new URL(request.url)
  // const id = searchParams.get('id')
  //
  // const url = new URL(req.url);
  // const searchParams = url.searchParams;
  //
  // const limit = searchParams.has('limit')
  //   ? clamp(searchParams.get('limit'), 1, 20)
  //   : 20;
  //
  // console.log(searchParams.has('limit'));
  // console.log(searchParams.get('limit'));

  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const companies = db.collection('companies');
  const cursor = companies.find();
  const companyDocuments = await cursor.toArray();

  const allCompanies = companyDocuments.map((d) => toCompany(d));

  allCompanies.sort((x, y) => {
    const xTotalBattles = x.wins + x.losses;
    const yTotalBattles = y.wins + y.losses;

    if (xTotalBattles === 0 && yTotalBattles === 0) {
      return 0;
    }
    if (xTotalBattles === 0) {
      return -1;
    }
    if (yTotalBattles === 0) {
      return 1;
    }

    const xWinPercentage = x.wins / xTotalBattles;
    const yWinPercentage = y.wins / yTotalBattles;

    return xWinPercentage > yWinPercentage ? -1 : 1;
  });

  return NextResponse.json(
    {
      companies: allCompanies,
    },
    { status: 200 },
  );
}

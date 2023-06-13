import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { Company, toCompany } from '@/app/api/battles/route';

type ResponseData = {
  companies: Company[];
};

type Error = {
  error: string;
};

export async function GET(
  _req: Request,
): Promise<NextResponse<ResponseData | Error>> {
  // TODO:
  // - paginate (limit, offset)... if we sort in code, we need to handle this.
  //    if we want to do it on the db layer, we'll need to store win % in the document.
  // - take a sort parameter (win %)

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

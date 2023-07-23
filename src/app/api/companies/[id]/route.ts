import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { toCompany } from '@/utils/models';
import { GetCompanyResponse, ErrorResponse } from '@/utils/requests';

export function getCompanyRankWindowFields() {
  return {
    sortBy: { winPercentage: -1 },
    output: {
      rank: { $denseRank: {} },
    },
  };
}

// TODO: should ideally return a Company | null... not a promise. Then we can make
// easier to use service functions
async function getCompany(companyId: string) {
  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const companies = db.collection('companies');

  // TODO: potentially use this method if rank is not needed
  // const company = await companies.findOne({
  //   _id: new ObjectId(companyId),
  // });
  // if (!company) {
  //   return NextResponse.json(
  //     { error: 'Company not found: ' + companyId },
  //     { status: 400 },
  //   );
  // }

  const cursor = companies.aggregate([
    {
      $setWindowFields: getCompanyRankWindowFields(),
    },
    {
      $match: { _id: new ObjectId(companyId) },
    },
  ]);
  const results = await cursor.toArray();
  if (results.length !== 1) {
    return NextResponse.json(
      { error: 'Company not found: ' + companyId },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      company: toCompany(results[0]),
    },
    { status: 200 },
  );
}

export function GET(
  req: NextRequest,
  context: { params: { id: string } },
): Promise<NextResponse<GetCompanyResponse | ErrorResponse>> {
  // TODO: error handling
  // - exists, is valid object id, etc

  const companyId = context.params.id;
  return getCompany(companyId);
}

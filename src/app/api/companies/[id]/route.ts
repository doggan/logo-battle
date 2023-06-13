import { NextRequest, NextResponse } from 'next/server';
import { Company, toCompany } from '@/app/api/battles/route';
import clientPromise from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

type ResponseData = {
  company: Company;
};

type Error = {
  error: string;
};

export async function GET(
  req: NextRequest,
  context: { params },
): Promise<NextResponse<ResponseData | Error>> {
  // TODO: error handling
  // - exists, is valid object id, etc.
  const companyId = context.params.id;

  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const companies = db.collection('companies');
  const company = await companies.findOne({
    _id: new ObjectId(companyId),
  });
  if (!company) {
    return NextResponse.json(
      { error: 'Company not found: ' + companyId },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      company: toCompany(company),
    },
    { status: 200 },
  );
}

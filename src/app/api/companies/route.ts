import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';
import { toCompany } from '@/utils/models';
import { ObjectId } from 'mongodb';
import {
  CompanySortBy,
  ErrorResponse,
  GetCompaniesResponse,
} from '@/utils/requests';
import { clamp } from '@/utils/math';
import { getCompanyRankWindowFields } from '@/app/api/companies/[id]/route';

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

async function getManyCompanies(companyIds: string[]) {
  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const filter = {};
  const companiesCollection = db.collection('companies');
  const cursor = companiesCollection.aggregate([
    {
      $setWindowFields: getCompanyRankWindowFields(),
    },
    {
      $match: {
        _id: {
          $in: companyIds.map((v) => new ObjectId(v)),
        },
      },
    },
  ]);

  const companyDocuments = await cursor.toArray();
  const companies = companyDocuments.map((d) => toCompany(d));

  const totalCompaniesCount = await companiesCollection.countDocuments(filter);

  return NextResponse.json(
    {
      companies: companies,
      totalCompaniesCount: totalCompaniesCount,
    },
    { status: 200 },
  );
}

async function listCompanies(
  offset: number,
  limit: number,
  // TODO: param not used
  sortBy: CompanySortBy | undefined,
) {
  // TODO: clean this up; how to predefine the available collections and db?
  // Ref: https://www.mongodb.com/compatibility/using-typescript-with-mongodb-tutorial
  const client = await clientPromise;
  const db = client.db();

  const companiesCollection = db.collection('companies');
  const filter = {};
  const cursor = companiesCollection
    .aggregate([
      {
        $setWindowFields: getCompanyRankWindowFields(),
      },
    ])
    .skip(offset)
    .limit(limit);
  const companyDocuments = await cursor.toArray();
  const companies = companyDocuments.map((d) => toCompany(d));
  const totalCompaniesCount = await companiesCollection.countDocuments(filter);

  return NextResponse.json(
    {
      companies: companies,
      totalCompaniesCount: totalCompaniesCount,
    },
    { status: 200 },
  );
}

export async function GET(
  req: NextRequest,
): Promise<NextResponse<GetCompaniesResponse | ErrorResponse>> {
  const { searchParams } = new URL(req.url);

  if (
    searchParams.has('ids') &&
    (searchParams.has('offset') ||
      searchParams.has('limit') ||
      searchParams.has('sortBy'))
  ) {
    return NextResponse.json(
      {
        error:
          'Cannot specify ids when using list params (offset, limit, etc).',
      },
      { status: 400 },
    );
  }

  if (searchParams.has('ids')) {
    let companyIds: string[] = [];
    const companyIdsParam = searchParams.get('ids');
    if (companyIdsParam) {
      companyIds = companyIdsParam.split(',');
      if (companyIds.length > 500) {
        return NextResponse.json(
          {
            error: 'Too many company IDs.',
          },
          { status: 400 },
        );
      }
    }

    return getManyCompanies(companyIds);
  }

  let offset = 0;
  if (searchParams.has('offset')) {
    offset = parseInt(searchParams.get('offset') as string) || offset;
  }
  offset = Math.max(offset, 0);

  let limit = DEFAULT_LIMIT;
  if (searchParams.has('limit')) {
    limit = parseInt(searchParams.get('limit') as string) || limit;
  }
  limit = clamp(limit, 1, MAX_LIMIT);

  let sortBy: CompanySortBy | undefined;
  if (searchParams.has('sortBy')) {
    const sortByParam = searchParams.get('sortBy');
    if (sortByParam) {
      sortBy = (<any>CompanySortBy)[sortByParam];
      if (!sortBy) {
        return NextResponse.json(
          {
            error: 'Invalid sortBy parameter.',
          },
          { status: 400 },
        );
      }
    }
  }

  return listCompanies(offset, limit, sortBy);
}

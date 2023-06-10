'use client';
// TODO: could this be a server component?? ^^ no need for state or use effect?

import { useEffect, useState } from 'react';

interface ICompany {
  _id: string;
  name: string;
}

async function GET(): Promise<ICompany[]> {
  const response = await fetch('/api/company', {
    method: 'GET',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
    // body: JSON.stringify({
    //   voteForCompanyId,
    //   voteAgainstCompanyId,
    // }),
  });

  // console.log('### response: ', response.json());

  const companies = await response.json();
  console.log('### data: ', companies);
  return companies;
  // return response;
}

export default function Page() {
  const [companies, setCompanies] = useState<ICompany[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const companies = await GET();
      setCompanies(companies);
    };

    // TODO:
    fetchData().catch(console.error);
  }, []);

  const renderedCompanies = companies.map((c) => {
    return (
      <div key={c._id}>
        {c._id} - {c.name}
      </div>
    );
  });

  return (
    <main>
      <div>recent!</div>
      <div>{renderedCompanies}</div>
    </main>
  );
}

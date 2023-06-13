'use client';

import useSWR from 'swr';
import Image from 'next/image';
import { Company } from '@/app/api/battles/route';

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Page({ params }: { params: { id: string } }) {
  const companyId = params.id;

  const { data } = useSWR(`/api/companies/${companyId}`, fetcher);

  if (!data) {
    return 'loading...';
  }

  const company: Company = data.company;

  console.log(company);

  return (
    <div>
      <Image
        className="w-full"
        src={`/logos/${company.imageName}`}
        width={100}
        height={100}
        alt={company.name}
      />
    </div>
  );
}

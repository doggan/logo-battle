'use client';

import Image from 'next/image';

interface ILogoProps {
  companyId: string;
  imageName: string;
  onClick: (companyId: string) => void;
}

export function Logo({ companyId, imageName, onClick }: ILogoProps) {
  return (
    <div className={'drop-shadow-md'}>
      <button onClick={() => onClick(companyId)}>
        <Image
          className="rounded grow"
          src={imageName}
          width={300}
          height={300}
          alt={'aaa'}
        />
      </button>
      {companyId}
    </div>
  );
}

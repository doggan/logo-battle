'use client';

import Image from 'next/image';

interface ILogoProps {
  companyId: string;
  companyName: string;
  imageName: string;
  onClick: (companyId: string) => void;
}

export function Logo({
  companyId,
  companyName,
  imageName,
  onClick,
}: ILogoProps) {
  return (
    <div>
      <button className={'shadow-md'} onClick={() => onClick(companyId)}>
        <Image
          className="rounded grow"
          src={imageName}
          width={400}
          height={400}
          alt={companyName}
        />
      </button>
      <div>{companyName}</div>
    </div>
  );
}

import Image from 'next/image';

interface ILogoProps {
  // companyName: string;
  imageName: string;
}

export function Logo({ imageName }: ILogoProps) {
  return (
    <div>
      <Image
        className="rounded grow"
        src={imageName}
        width={300}
        height={300}
        alt={'aaa'}
      />
    </div>
  );
}

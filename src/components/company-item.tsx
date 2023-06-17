import { Company } from '@/utils/models';
import Image from 'next/image';
import { formatPercentage } from '@/utils/math';

interface ICompanyItemProps {
  rank: number;
  company: Company;
  onClick?: (companyId: string) => void;
}

export function CompanyItem({ rank, company, onClick }: ICompanyItemProps) {
  const { id, imageName, name, wins, losses } = company;

  const renderContents = () => {
    return (
      <>
        <div
          className={'absolute top-0 left-0 bg-gray-400 rounded-tl rounded-br'}
        >
          <span className={'p-1 text-white font-bold'}>#{rank}</span>
        </div>
        <div className="p-4 flex flex-row">
          <div className={'flex items-center'}>
            <Image
              className="w-full"
              src={`/logos/${imageName}`}
              width={100}
              height={100}
              alt={name}
            />
          </div>
          <div className="pl-4">
            <div className="text-gray-900 font-bold text-xl mb-2">{name}</div>
            <p className="text-gray-700 text-base">
              Win Rate:{' '}
              <span className={'font-bold'}>
                {formatPercentage(wins / (wins + losses))}%
              </span>
              <br />
              Wins: <span className={'text-green-500 font-bold'}>{wins}</span>
              <br />
              Losses: <span className={'text-red-500 font-bold'}>{losses}</span>
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {onClick ? (
        <button
          className="bg-white rounded shadow-md relative"
          onClick={() => onClick?.(id)}
        >
          {renderContents()}
        </button>
      ) : (
        <div className={'bg-white rounded shadow-md relative'}>
          {renderContents()}
        </div>
      )}
    </>
  );
}

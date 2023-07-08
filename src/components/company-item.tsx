import { Company } from '@/utils/models';
import Image from 'next/image';
import { formatPercentage } from '@/utils/math';

interface CompanyItemProps {
  rank: number;
  company: Company;
  onClick?: (companyId: string) => void;
}

export function CompanyItem({ rank, company, onClick }: CompanyItemProps) {
  const { id, imageName, name, wins = 0, losses = 0 } = company;

  const totalBattles = wins + losses;
  const renderPercentage = () => {
    if (totalBattles === 0) {
      return '-';
    }

    return formatPercentage(wins / (wins + losses)) + '%';
  };

  return (
    <div className={'w-full flex justify-center px-4 md:px-0'}>
      <div className="bg-white rounded-sm shadow-md relative w-full md:w-2/5">
        <div
          className={
            'absolute top-0 left-0 bg-gray-400 rounded-tl-sm rounded-br-sm'
          }
        >
          <span className={'p-1 text-white font-bold'}>#{rank}</span>
        </div>
        <div className="p-4 flex flex-row">
          <button
            className={'w-1/4'}
            disabled={!onClick}
            onClick={() => onClick?.(id)}
          >
            <div className={'flex items-center relative w-full h-full'}>
              <Image
                className="object-contain"
                src={`/logos/${imageName}`}
                fill={true}
                sizes={'200px'}
                alt={name}
              />
            </div>
          </button>
          <div className="w-3/4 pl-4">
            <div className="font-bold text-lg">{name}</div>
            <p className="">
              Win Rate:{' '}
              <span className={'font-bold'}>{renderPercentage()}</span>
              <br />
              Wins: <span className={'text-green-500 font-bold'}>{wins}</span>
              <br />
              Losses: <span className={'text-red-500 font-bold'}>{losses}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

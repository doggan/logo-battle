import { Logo } from '@/app/logo';

export default function Page() {
  return (
    <main className={'w-screen flex flex-col items-center'}>
      <div
        className={'p-8 flex justify-between items-center flex-col md:flex-row'}
      >
        <Logo imageName={'/logos/test1.svg'} />
        <div className={'p-5'}>vs.</div>
        <Logo imageName={'/logos/test1.svg'} />
      </div>
    </main>
  );
}

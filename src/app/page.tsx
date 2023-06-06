import { Logo } from '@/app/logo';

export default function Page() {
  return (
    <main>
      <div className={''}>
        <Logo imageName={'/logos/test1.svg'} />
        vs
        <Logo imageName={'/logos/test1.svg'} />
      </div>
    </main>
  );
}

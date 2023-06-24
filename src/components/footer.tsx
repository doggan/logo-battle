import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <section className="text-center pt-4 pb-4">
      <hr className="border-zinc-400 opacity-60 text-center text-2xl w-5/6 m-auto pb-2" />
      <div className="font-light pb-1">
        Built by{' '}
        <Link href="https://shy.am" target="_blank" className={'underline'}>
          Shyam Guthikonda
        </Link>{' '}
        in 2023
      </div>
      <div>
        <a
          className="text-3xl"
          href={'https://github.com/doggan/logo-battle'}
          target="_blank"
        >
          <FontAwesomeIcon className={'text-md'} icon={faGithub} />
        </a>
      </div>
    </section>
  );
}

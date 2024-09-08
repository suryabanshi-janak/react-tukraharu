import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import {
  ChartBarIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  Square2StackIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';

const containerVariants: Variants = {
  closed: {
    width: '5rem',
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: '16rem',
    transition: {
      type: 'spring',
      damping: 15,
      duration: 0.5,
    },
  },
};

const svgVariants: Variants = {
  closed: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
};

const navVariants: Variants = {
  closed: {
    height: 0,
    opacity: 0,
  },
  open: {
    height: 'auto',
    opacity: 1,
  },
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const onToggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <main className='relative flex flex-row w-full h-screen'>
      {/* SIDEBAR */}
      <motion.aside
        variants={containerVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial='closed'
        className='absolute top-0 left-0 z-10 flex flex-col w-20 h-full gap-20 p-5 shadow bg-neutral-900 shadow-neutral-600'
      >
        <div className='flex flex-row justify-between w-full place-items-center'>
          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-700' />
          <button className='flex p-1 rounded-full' onClick={onToggleSidebar}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth={1}
              stroke='currentColor'
              className='w-8 h-8 stroke-neutral-200'
            >
              <motion.path
                variants={svgVariants}
                strokeLinejoin='round'
                d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3'
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </button>
        </div>

        <div className='flex flex-col gap-3'>
          <NavigationLink name='Dashboard'>
            <ChartBarIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
          </NavigationLink>
          <NavigationLink name='Projects'>
            <Square2StackIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
          </NavigationLink>
          <NavigationLink name='Tasks'>
            <DocumentCheckIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
          </NavigationLink>
          <NavigationLink name='Reporting'>
            <ChartPieIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
          </NavigationLink>
          <NavigationLink name='Users'>
            <UsersIcon className='stroke-inherit stroke-[0.75] min-w-8 w-8' />
          </NavigationLink>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <section className='flex flex-col w-full gap-5 p-10 ml-20'>
        <h1 className='text-4xl text-neutral-200'>Dashboard</h1>
        <div className='w-full border rounded h-80 border-neutral-500/50 bg-neutral-800/20' />
        <div className='flex flex-row w-full gap-5'>
          <div className='w-1/2 border rounded border-neutral-500/50 h-60 bg-neutral-800/20' />
          <div className='w-1/2 border rounded border-neutral-500/50 h-60 bg-neutral-800/20' />
        </div>
      </section>
    </main>
  );
}

function NavigationLink({
  children,
  name,
}: {
  children: React.ReactNode;
  name: string;
}) {
  return (
    <a
      href='#'
      className='flex p-1 rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100'
    >
      {children}
      <motion.p
        variants={navVariants}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
          y: { stiffness: 1000 },
        }}
        className='tracking-wide text-inherit font-poppins overflow-clip whitespace-nowrap'
      >
        {name}
      </motion.p>
    </a>
  );
}

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FolderIcon, File, ChevronRightIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type Node = {
  name: string;
  nodes?: Node[];
};

const nodes: Node[] = [
  {
    name: 'Home',
    nodes: [
      {
        name: 'Movies',
        nodes: [
          {
            name: 'Action',
            nodes: [
              {
                name: '2000s',
                nodes: [
                  { name: 'Gladiator.mp4' },
                  { name: 'The-Dark-Knight.mp4' },
                ],
              },
              { name: '2010s', nodes: [] },
            ],
          },
          {
            name: 'Comedy',
            nodes: [{ name: '2000s', nodes: [{ name: 'Superbad.mp4' }] }],
          },
          {
            name: 'Drama',
            nodes: [
              { name: '2000s', nodes: [{ name: 'American-Beauty.mp4' }] },
            ],
          },
        ],
      },
      {
        name: 'Music',
        nodes: [
          { name: 'Rock', nodes: [] },
          { name: 'Classical', nodes: [] },
        ],
      },
      { name: 'Pictures', nodes: [] },
      {
        name: 'Documents',
        nodes: [],
      },
      { name: 'passwords.txt' },
    ],
  },
];

export default function RecursiveFileTree() {
  return (
    <ul>
      {nodes.map((node) => (
        <FileSystemItem key={node.name} node={node} />
      ))}
    </ul>
  );
}

function FileSystemItem({ node }: { node: Node }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <li key={node.name}>
      <span className='flex items-center gap-1.5 py-1'>
        {node.nodes && node.nodes.length > 0 && (
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className='p-1 -m-1'
          >
            <motion.span
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className='flex'
            >
              <ChevronRightIcon className='text-gray-500 size-4' />
            </motion.span>
          </button>
        )}
        {node.nodes ? (
          <FolderIcon
            className={cn(
              'text-blue-500 size-5',
              node.nodes.length === 0 ? 'ml-[22px]' : ''
            )}
          />
        ) : (
          <File className='text-gray-600 size-5 ml-[22px]' />
        )}
        {node.name}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0 }}
            className='flex flex-col justify-end pl-6 overflow-hidden'
          >
            {node.nodes?.map((node) => (
              <FileSystemItem node={node} key={node.name} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );
}

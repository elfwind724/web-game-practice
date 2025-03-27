import React from 'react';
import MemoryGame from '../components/features/MemoryGame';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

interface MemoryGamePageProps {
  windowWidth: number;
  windowHeight: number;
}

const MemoryGamePage: React.FC<MemoryGamePageProps> = ({ windowWidth, windowHeight }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="inline-block mr-2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            返回主页
          </Button>
        </Link>
      </div>
      
      <div className="memory-game-wrapper" style={{ 
        maxWidth: `${Math.min(windowWidth * 0.9, 800)}px`,
        margin: '0 auto'
      }}>
        <MemoryGame windowWidth={windowWidth} windowHeight={windowHeight} />
      </div>
    </div>
  );
};

export default MemoryGamePage; 
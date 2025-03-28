import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import Home from './pages/Home';
import MemoryGamePage from './pages/MemoryGamePage';
import SurvivorGame from './components/game/SurvivorGame';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // 响应式布局处理
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      
      // 设置根元素CSS变量，用于响应式调整
      document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
      document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
      
      // 计算适合当前屏幕的游戏区域大小
      const gameSize = Math.min(
        window.innerWidth * 0.9,
        window.innerHeight * 0.7,
        600 // 最大尺寸
      );
      document.documentElement.style.setProperty('--game-container-size', `${gameSize}px`);
      
      // 根据屏幕尺寸调整卡片网格列数
      let columns = 5; // 默认列数
      if (window.innerWidth < 480) {
        columns = 3;
      } else if (window.innerWidth < 768) {
        columns = 4;
      }
      document.documentElement.style.setProperty('--grid-columns', `${columns}`);
    };

    // 初始化设置
    handleResize();

    // 添加监听器
    window.addEventListener('resize', handleResize);
    
    // 清理监听器
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/web-game-practice">
        <div className="app-container">
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/games/memory" element={
                <MemoryGamePage 
                  windowWidth={windowSize.width} 
                  windowHeight={windowSize.height} 
                />
              } />
              <Route path="/games/survivor" element={<SurvivorGame />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

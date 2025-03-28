import React, { useState, useEffect, useRef } from 'react';
import Button from '../ui/Button';

interface CardItem {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

interface MemoryGameProps {
  windowWidth: number;
  windowHeight: number;
}

// 精美的表情符号集合
const emojis = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🍍', '🥝', '🍒', '🥭', '🍑', '🍈', '🍏'];

const MemoryGame: React.FC<MemoryGameProps> = ({ windowWidth }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(180); // 3分钟，以秒为单位
  const [showAnimation, setShowAnimation] = useState<boolean>(false);
  const [gridColumns, setGridColumns] = useState<number>(5); // 默认网格列数
  
  // 根据屏幕尺寸调整游戏参数
  useEffect(() => {
    // 根据窗口宽度调整网格列数
    if (windowWidth < 480) {
      setGridColumns(3);
    } else if (windowWidth < 768) {
      setGridColumns(4);
    } else {
      setGridColumns(5);
    }
  }, [windowWidth]);
  
  // 用于动画调用的ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // 初始化游戏
  const initializeGame = () => {
    setShowAnimation(true);
    
    // 短暂延迟以显示加载动画
    setTimeout(() => {
      // 创建所需的卡牌对 (25张卡牌，12对 + 1张单卡)
      const pairsNeeded = 12;
      const selectedEmojis = [...emojis].sort(() => Math.random() - 0.5).slice(0, pairsNeeded + 1);
      let cardValues = [...selectedEmojis, ...selectedEmojis.slice(0, -1)]; // 复制除最后一个之外的所有表情符号
      
      // 打乱卡牌顺序
      const shuffledCards = cardValues
        .sort(() => Math.random() - 0.5)
        .map((value, index) => ({
          id: index,
          value,
          flipped: false,
          matched: false,
        }));
      
      setCards(shuffledCards);
      setFlippedCards([]);
      setMatchedPairs(0);
      setMoves(0);
      setScore(0);
      setGameStarted(true);
      setGameOver(false);
      setTimeLeft(180); // 重置为3分钟
      setShowAnimation(false);
    }, 800);
  };

  // 处理卡牌点击
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched || timeLeft <= 0 || showAnimation) {
      return;
    }

    // 翻转卡牌
    const updatedCards = [...cards];
    updatedCards[id].flipped = true;
    setCards(updatedCards);

    // 将卡牌添加到已翻转卡牌中
    const updatedFlippedCards = [...flippedCards, id];
    setFlippedCards(updatedFlippedCards);

    // 如果已翻转两张卡牌，检查是否匹配
    if (updatedFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = updatedFlippedCards;
      const firstCard = updatedCards[firstCardId];
      const secondCard = updatedCards[secondCardId];

      if (firstCard.value === secondCard.value) {
        // 匹配成功!
        updatedCards[firstCardId].matched = true;
        updatedCards[secondCardId].matched = true;
        setCards(updatedCards);
        setFlippedCards([]);
        setMatchedPairs(matchedPairs + 1);
        setScore(score + 10); // 每次匹配加10分
        
        // 添加特效
        playMatchEffect();
        
        // 检查游戏是否结束 (找到所有12对)
        if (matchedPairs + 1 === 12) {
          setTimeout(() => {
            setGameOver(true);
          }, 1000);
        }
      } else {
        // 不匹配，将卡牌翻回
        setShowAnimation(true);
        setTimeout(() => {
          updatedCards[firstCardId].flipped = false;
          updatedCards[secondCardId].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
          setShowAnimation(false);
        }, 1000);
      }
    }
  };

  // 匹配成功时的视觉效果
  const playMatchEffect = () => {
    // 可以在这里添加声音效果或者更多视觉反馈
  };

  // 计时器
  useEffect(() => {
    if (gameStarted && !gameOver && timeLeft > 0 && !showAnimation) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            // 时间到
            if (timerRef.current) clearInterval(timerRef.current);
            setGameOver(true);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, timeLeft, showAnimation]);

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 计算游戏容器的样式
  const gameContainerStyle = {
    maxWidth: `min(${windowWidth * 0.9}px, 600px)`,
    width: '100%',
  };

  // 计算卡片网格的样式
  const gridStyle = {
    gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
    gap: windowWidth < 480 ? '0.5rem' : '0.75rem'
  };

  return (
    <div className="memory-game-container" style={gameContainerStyle}>
      {!gameStarted ? (
        <div className="game-start-screen">
          <div className="game-title">
            <h1>记忆翻牌</h1>
            <p className="subtitle">找到所有配对卡片</p>
          </div>
          <Button 
            onClick={initializeGame} 
            className="start-button"
          >
            开始游戏
          </Button>
        </div>
      ) : (
        <div className="game-play-area">
          {/* 游戏顶部信息栏 */}
          <div className="game-info-bar">
            <div className="info-item">
              <span className="info-label">步数</span>
              <span className="info-value">{moves}</span>
            </div>
            <div className="info-item title">
              <h2>记忆翻牌</h2>
            </div>
            <div className="info-item">
              <span className="info-label">得分</span>
              <span className="info-value">{score}</span>
            </div>
          </div>
          
          {/* 卡片网格 */}
          <div className="memory-card-grid" style={gridStyle}>
            {cards.map((card) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`memory-card ${card.flipped ? 'flipped' : ''} ${card.matched ? 'matched' : ''}`}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <span className="card-value">{card.value}</span>
                  </div>
                  <div className="card-back">
                    <span className="question-mark">?</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* 底部计时器 */}
          <div className="timer-container">
            <div className="timer">
              <span className="timer-label">倒计时</span>
              <span className="timer-value">{formatTime(timeLeft)}</span>
            </div>
          </div>
          
          {/* 加载动画 */}
          {showAnimation && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
          
          {/* 游戏结束弹窗 */}
          {gameOver && (
            <div className="game-over-overlay">
              <div className="game-over-modal">
                <h2 className="game-over-title">
                  {timeLeft === 0 ? '时间到!' : '游戏完成!'}
                </h2>
                <div className="game-stats">
                  <div className="stat-item">
                    <span className="stat-label">得分</span>
                    <span className="stat-value">{score}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">用时</span>
                    <span className="stat-value">{180 - timeLeft}秒</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">步数</span>
                    <span className="stat-value">{moves}</span>
                  </div>
                </div>
                <div className="game-over-actions">
                  <Button onClick={initializeGame} className="play-again-btn">
                    再玩一次
                  </Button>
                  <Button 
                    onClick={() => setGameStarted(false)} 
                    variant="outline" 
                    className="back-btn"
                  >
                    返回主页
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MemoryGame; 
import React from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  // 热门推荐游戏
  const featuredGames = [
    {
      id: 'memory',
      title: '记忆游戏',
      description: '翻转卡片，找到配对的图案。训练你的记忆力和观察力。',
      imageUrl: '/images/memory-game.svg',
      path: '/games/memory',
      hot: true
    },
    {
      id: 'puzzle',
      title: '拼图挑战',
      description: '移动方块，还原图像。挑战你的空间思维能力。',
      imageUrl: '/images/puzzle-game.svg',
      path: '/',
      comingSoon: true
    },
    {
      id: 'tetris',
      title: '俄罗斯方块',
      description: '经典的俄罗斯方块游戏，考验你的反应和策略。',
      imageUrl: '/images/tetris-game.svg',
      path: '/',
      comingSoon: true
    },
    {
      id: 'snake',
      title: '贪吃蛇',
      description: '控制蛇吃食物并成长，但不要撞到墙或自己的身体。',
      imageUrl: '/images/snake-game.svg',
      path: '/',
      comingSoon: true
    },
    {
      id: '2048',
      title: '2048',
      description: '合并方块，达到2048。一个经典的数字益智游戏。',
      imageUrl: '/images/2048-game.svg',
      path: '/',
      comingSoon: true
    }
  ];

  // 最新游戏
  const newGames = [
    {
      id: 'memory-pro',
      title: '高级记忆游戏',
      description: '记忆游戏的升级版，更多挑战和难度选择。',
      imageUrl: '/images/memory-pro.svg',
      path: '/games/memory',
      new: true
    },
    {
      id: 'word-puzzle',
      title: '单词找茬',
      description: '找出隐藏在字母网格中的单词，挑战你的词汇量。',
      imageUrl: '/images/word-puzzle.svg',
      path: '/',
      comingSoon: true
    },
    {
      id: 'sudoku',
      title: '数独',
      description: '填充9x9网格，使每行、每列和每个3x3子网格包含1-9的数字。',
      imageUrl: '/images/sudoku-game.svg',
      path: '/',
      comingSoon: true
    }
  ];

  // 推荐游戏
  const recommendedGames = [
    {
      id: 'memory',
      title: '记忆游戏',
      description: '翻转卡片，找到配对的图案。训练你的记忆力和观察力。',
      imageUrl: '/images/memory-game.svg',
      path: '/games/memory',
      rating: 4.8
    },
    {
      id: 'coming-soon-1',
      title: '敬请期待',
      description: '更多游戏正在开发中...',
      imageUrl: '/images/coming-soon.svg',
      path: '/',
      comingSoon: true
    },
    {
      id: 'coming-soon-2',
      title: '敬请期待',
      description: '更多游戏正在开发中...',
      imageUrl: '/images/coming-soon.svg',
      path: '/',
      comingSoon: true
    }
  ];

  return (
    <div className="game-platform-container">
      {/* 顶部导航 */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-logo">
            <h1>React游戏平台</h1>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link active">热门推荐</a>
            <a href="#" className="nav-link">最新游戏</a>
            <a href="#" className="nav-link">休闲游戏</a>
            <a href="#" className="nav-link">益智解谜</a>
            <a href="#" className="nav-link">动作冒险</a>
            <a href="#" className="nav-link">策略游戏</a>
          </div>
          <div className="nav-search">
            <input type="text" placeholder="搜索游戏..." />
            <button className="search-btn">搜索</button>
          </div>
        </div>
      </nav>

      {/* 主横幅 */}
      <div className="main-banner">
        <div className="banner-content">
          <h2>欢迎来到React游戏平台</h2>
          <p>体验现代Web技术构建的有趣游戏</p>
          <Link to="/games/memory" className="banner-btn">立即开始</Link>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="content-container">
        {/* 热门推荐 */}
        <section className="game-section">
          <div className="section-header">
            <h2>热门推荐</h2>
            <a href="#" className="more-link">更多 &gt;</a>
          </div>
          <div className="game-grid">
            {featuredGames.map((game) => (
              <div className="game-card" key={game.id}>
                <div className="game-card-img">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Game+Image';
                    }}
                  />
                  {game.hot && <span className="hot-tag">热门</span>}
                  {game.comingSoon && <div className="coming-soon-overlay">敬请期待</div>}
                </div>
                <div className="game-card-content">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                </div>
                <Link 
                  to={game.path} 
                  className={`game-card-btn ${game.comingSoon ? 'disabled' : ''}`}
                  onClick={(e) => game.comingSoon && e.preventDefault()}
                >
                  {game.comingSoon ? '敬请期待' : '开始游戏'}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 最新游戏 */}
        <section className="game-section">
          <div className="section-header">
            <h2>最新游戏</h2>
            <a href="#" className="more-link">更多 &gt;</a>
          </div>
          <div className="game-grid">
            {newGames.map((game) => (
              <div className="game-card" key={game.id}>
                <div className="game-card-img">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Game+Image';
                    }}
                  />
                  {game.new && <span className="new-tag">新品</span>}
                  {game.comingSoon && <div className="coming-soon-overlay">敬请期待</div>}
                </div>
                <div className="game-card-content">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                </div>
                <Link 
                  to={game.path} 
                  className={`game-card-btn ${game.comingSoon ? 'disabled' : ''}`}
                  onClick={(e) => game.comingSoon && e.preventDefault()}
                >
                  {game.comingSoon ? '敬请期待' : '开始游戏'}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 推荐游戏 */}
        <section className="game-section">
          <div className="section-header">
            <h2>推荐游戏</h2>
            <a href="#" className="more-link">更多 &gt;</a>
          </div>
          <div className="game-grid">
            {recommendedGames.map((game) => (
              <div className="game-card" key={game.id}>
                <div className="game-card-img">
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Game+Image';
                    }}
                  />
                  {game.rating && <span className="rating-tag">{game.rating}</span>}
                  {game.comingSoon && <div className="coming-soon-overlay">敬请期待</div>}
                </div>
                <div className="game-card-content">
                  <h3>{game.title}</h3>
                  <p>{game.description}</p>
                </div>
                <Link 
                  to={game.path} 
                  className={`game-card-btn ${game.comingSoon ? 'disabled' : ''}`}
                  onClick={(e) => game.comingSoon && e.preventDefault()}
                >
                  {game.comingSoon ? '敬请期待' : '开始游戏'}
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* 底部信息 */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>关于我们</h3>
            <p>这是一个使用React和TypeScript构建的游戏平台，旨在展示现代Web开发技术。</p>
          </div>
          <div className="footer-section">
            <h3>联系方式</h3>
            <p>邮箱: example@example.com</p>
            <p>GitHub: github.com/example</p>
          </div>
          <div className="footer-section">
            <h3>版权信息</h3>
            <p>&copy; 2023 React游戏平台. 保留所有权利.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 
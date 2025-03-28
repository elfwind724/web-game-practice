import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore 忽略模块导入错误
import useGameLoop from '../../hooks/useGameLoop';
import './SurvivorGame.css';

// 资源路径
const playerImagePath = './assets/images/survivor/player.png';
const bulletEffectsPath = './assets/images/survivor/bullet_effects.png';

// 游戏状态类型
interface GameState {
  player: {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    health: number;
    maxHealth: number;
    level: number;
    experience: number;
    experienceToNextLevel: number;
  };
  bullets: {
    id: number;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    speed: number;
    damage: number;
    radius: number;
    color: string;
    type: string;
  }[];
  enemies: {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    health: number;
    maxHealth: number;
    speed: number;
    damage: number;
    type: string;
    experienceValue: number;
  }[];
  pickups: {
    id: number;
    x: number;
    y: number;
    radius: number;
    type: string;
    value: number;
  }[];
  gameTime: number;
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
  showLevelUp: boolean | true | false;
  levelUpOptions: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }[];
  weaponTypes: string[];
  activeWeapons: {
    type: string;
    level: number;
    fireRate: number;
    lastFired: number;
    damage: number;
    speed: number;
    projectileCount: number;
    projectileSpread: number;
  }[];
  lastInputTime: number;
}

// 按键状态类型
interface KeyState {
  w: boolean;
  a: boolean;
  s: boolean;
  d: boolean;
}

const SurvivorGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerImageRef = useRef<HTMLImageElement | null>(null);
  const bulletImageRef = useRef<HTMLImageElement | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      width: 60,
      height: 60,
      speed: 8,
      health: 100,
      maxHealth: 100,
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
    },
    bullets: [],
    enemies: [],
    pickups: [],
    gameTime: 0,
    score: 0,
    isGameOver: false,
    isPaused: false,
    showLevelUp: false,
    levelUpOptions: [],
    weaponTypes: ['basic', 'spread', 'piercing', 'homing', 'explosive'],
    activeWeapons: [
      {
        type: 'basic',
        level: 1,
        fireRate: 500, // 毫秒
        lastFired: 0,
        damage: 10,
        speed: 8,
        projectileCount: 1,
        projectileSpread: 0,
      },
    ],
    lastInputTime: 0,
  });

  const [keyState, setKeyState] = useState<KeyState>({
    w: false,
    a: false,
    s: false,
    d: false,
  });

  // 加载图片
  useEffect(() => {
    // 创建并加载玩家图片
    const playerImg = new Image();
    playerImg.src = playerImagePath;
    playerImg.onload = () => {
      console.log('玩家图片加载成功:', playerImagePath);
      playerImageRef.current = playerImg;
    };
    playerImg.onerror = (e) => {
      console.error('玩家图片加载失败:', e, playerImagePath);
    };

    // 创建并加载子弹效果图片
    const bulletImg = new Image();
    bulletImg.src = bulletEffectsPath;
    bulletImg.onload = () => {
      console.log('子弹效果图片加载成功:', bulletEffectsPath);
      bulletImageRef.current = bulletImg;
    };
    bulletImg.onerror = (e) => {
      console.error('子弹效果图片加载失败:', e, bulletEffectsPath);
    };

    // 重要：确保canvas元素获得键盘焦点
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.tabIndex = 0; // 使canvas可以接收键盘焦点
      canvas.focus();
    }

    // 添加键盘事件监听（使用捕获模式确保事件被捕获）
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('键盘按下:', e.key);
      let keyChanged = false;
      
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        setKeyState(prev => {
          keyChanged = prev.w !== true;
          return { ...prev, w: true };
        });
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        setKeyState(prev => {
          keyChanged = prev.a !== true;
          return { ...prev, a: true };
        });
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        setKeyState(prev => {
          keyChanged = prev.s !== true;
          return { ...prev, s: true };
        });
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        setKeyState(prev => {
          keyChanged = prev.d !== true;
          return { ...prev, d: true };
        });
      }
      
      if (keyChanged) {
        console.log('键盘状态已更新(DOWN):', e.key);
      }
      
      // 防止默认行为，如页面滚动
      e.preventDefault();
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      console.log('键盘释放:', e.key);
      let keyChanged = false;
      
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        setKeyState(prev => {
          keyChanged = prev.w !== false;
          return { ...prev, w: false };
        });
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        setKeyState(prev => {
          keyChanged = prev.a !== false;
          return { ...prev, a: false };
        });
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        setKeyState(prev => {
          keyChanged = prev.s !== false; 
          return { ...prev, s: false };
        });
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        setKeyState(prev => {
          keyChanged = prev.d !== false;
          return { ...prev, d: false };
        });
      }
      
      if (keyChanged) {
        console.log('键盘状态已更新(UP):', e.key);
      }
      
      // 防止默认行为
      e.preventDefault();
    };

    // 通过添加冒泡和捕获阶段两种监听来确保键盘事件被捕获
    document.addEventListener('keydown', handleKeyDown, true); // 捕获阶段
    document.addEventListener('keyup', handleKeyUp, true); // 捕获阶段
    window.addEventListener('keydown', handleKeyDown); // 冒泡阶段备份
    window.addEventListener('keyup', handleKeyUp); // 冒泡阶段备份

    // 在组件卸载时清除事件监听器
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // 初始化并调整Canvas大小
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 函数：调整Canvas大小
    const resizeCanvas = () => {
      // 设置Canvas尺寸为全屏
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // 更新游戏状态中的玩家位置到屏幕中心
      setGameState(prevState => ({
        ...prevState,
        player: {
          ...prevState.player,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
      }));
      
      console.log(`Canvas尺寸已调整为: ${canvas.width}x${canvas.height}`);
    };
    
    // 初始尺寸设置
    resizeCanvas();
    
    // 添加窗口大小变化监听
    window.addEventListener('resize', resizeCanvas);
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // 游戏更新逻辑
  const updateGame = (deltaTime: number) => {
    if (gameState.isGameOver || gameState.isPaused) return;

    // 确保deltaTime正常
    const normalizedDeltaTime = deltaTime > 100 ? 16 : deltaTime;

    // 更新游戏时间
    const updatedGameTime = gameState.gameTime + normalizedDeltaTime;

    // 调试日志
    if (updatedGameTime % 1000 < normalizedDeltaTime) {
      console.log('游戏运行中:', {
        gameTime: updatedGameTime,
        playerPos: { x: gameState.player.x, y: gameState.player.y },
        enemies: gameState.enemies.length,
        bullets: gameState.bullets.length,
        keyState: JSON.stringify(keyState) // 详细打印键盘状态
      });
    }

    // 更新玩家位置
    let playerX = gameState.player.x;
    let playerY = gameState.player.y;
    
    // 增加移动速度，使移动更明显
    const moveSpeed = gameState.player.speed * 1.5;

    // 使用键盘状态更新玩家位置
    const diagonalMovement = (keyState.w || keyState.s) && (keyState.a || keyState.d);
    const diagonalFactor = diagonalMovement ? 0.7071 : 1; // 约等于 1/sqrt(2)，对角线移动时的速度调整
    
    // 记录是否有移动输入
    let hasMovementInput = false;
    
    if (keyState.w) {
      playerY -= moveSpeed * diagonalFactor * (normalizedDeltaTime / 16);
      hasMovementInput = true;
    }
    if (keyState.s) {
      playerY += moveSpeed * diagonalFactor * (normalizedDeltaTime / 16);
      hasMovementInput = true;
    }
    if (keyState.a) {
      playerX -= moveSpeed * diagonalFactor * (normalizedDeltaTime / 16);
      hasMovementInput = true;
    }
    if (keyState.d) {
      playerX += moveSpeed * diagonalFactor * (normalizedDeltaTime / 16);
      hasMovementInput = true;
    }
    
    // 如果有按键输入，记录并打印移动信息
    if (hasMovementInput) {
      console.log('玩家移动: ', {
        from: { x: gameState.player.x, y: gameState.player.y },
        to: { x: playerX, y: playerY },
        moveSpeed,
        deltaTime: normalizedDeltaTime
      });
    }

    // 手动触发键盘调试 - 如果5秒内没有输入，尝试自动向右移动
    const idleTime = updatedGameTime - gameState.lastInputTime;
    if (!hasMovementInput && idleTime > 5000 && updatedGameTime % 1000 < normalizedDeltaTime) {
      console.log("长时间无输入，尝试模拟键盘输入测试");
      // 随机选择一个方向自动移动一下
      const directions = ['w', 'a', 's', 'd'];
      const randomDir = directions[Math.floor(Math.random() * directions.length)];
      
      switch(randomDir) {
        case 'w':
          playerY -= 50;
          break;
        case 'a':
          playerX -= 50;
          break;
        case 's':
          playerY += 50;
          break;
        case 'd':
          playerX += 50;
          break;
      }
      
      console.log(`自动测试移动: ${randomDir}方向`);
    }

    // 限制玩家在画布内
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    playerX = Math.max(gameState.player.width / 2, Math.min(playerX, canvasWidth - gameState.player.width / 2));
    playerY = Math.max(gameState.player.height / 2, Math.min(playerY, canvasHeight - gameState.player.height / 2));

    // 生成敌人 - 确保新生成的敌人足够大
    let updatedEnemies = [...gameState.enemies];
    
    // 如果没有敌人，强制生成至少一个敌人
    const shouldForceSpawnEnemy = updatedEnemies.length === 0;
    
    // 增加敌人生成速率，每秒最多生成3个敌人
    const enemySpawnRate = 1000 / Math.min(3, 1 + Math.floor(updatedGameTime / 10000));
    
    // 如果距离上次生成敌人的时间大于生成速率，则生成新敌人
    if (shouldForceSpawnEnemy || updatedGameTime % enemySpawnRate < normalizedDeltaTime) {
      // 可视区域偏移量，确保生成在屏幕边缘稍微外一点
      const offset = 100;
      
      // 确定生成位置
      const spawnEdge = Math.floor(Math.random() * 4); // 0: 上, 1: 右, 2: 下, 3: 左
      let enemyX = 0;
      let enemyY = 0;
      
      switch (spawnEdge) {
        case 0: // 上边界
          enemyX = Math.random() * canvasWidth;
          enemyY = -offset;
          break;
        case 1: // 右边界
          enemyX = canvasWidth + offset;
          enemyY = Math.random() * canvasHeight;
          break;
        case 2: // 下边界
          enemyX = Math.random() * canvasWidth;
          enemyY = canvasHeight + offset;
          break;
        case 3: // 左边界
          enemyX = -offset;
          enemyY = Math.random() * canvasHeight;
          break;
      }
      
      // 选择敌人类型
      const enemyType = 'basic'; // 简化为只用一种敌人类型进行测试
      
      // 增大敌人尺寸，使其更明显
      const enemyWidth = 60;  // 大尺寸敌人
      const enemyHeight = 60;
      const enemyHealth = 50;
      const enemySpeed = 2;
      
      // 生成并添加敌人
      const newEnemy = {
        id: Date.now() + Math.random(),
        x: enemyX,
        y: enemyY,
        width: enemyWidth,
        height: enemyHeight,
        health: enemyHealth,
        maxHealth: enemyHealth,
        speed: enemySpeed,
        damage: 10,
        type: enemyType,
        experienceValue: 10,
      };
      
      updatedEnemies.push(newEnemy);
      console.log('生成新敌人:', {
        position: { x: enemyX, y: enemyY },
        size: { width: enemyWidth, height: enemyHeight },
        type: enemyType
      });
    }

    // 更新敌人位置 - 朝玩家移动
    updatedEnemies = updatedEnemies.map(enemy => {
      // 计算到玩家的方向
      const dx = playerX - enemy.x;
      const dy = playerY - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 确保不会除以零
      const normalizedDx = distance > 0 ? dx / distance : 0;
      const normalizedDy = distance > 0 ? dy / distance : 0;
      
      // 更新敌人位置 - 使用deltaTime确保在不同帧率下速度一致
      const newX = enemy.x + normalizedDx * enemy.speed * (normalizedDeltaTime / 16);
      const newY = enemy.y + normalizedDy * enemy.speed * (normalizedDeltaTime / 16);
      
      return {
        ...enemy,
        x: newX,
        y: newY
      };
    });

    // 更新游戏状态
    setGameState({
      ...gameState,
      player: {
        ...gameState.player,
        x: playerX,
        y: playerY,
      },
      enemies: updatedEnemies,
      gameTime: updatedGameTime,
      // 如果有移动输入，更新最后输入时间
      lastInputTime: hasMovementInput ? updatedGameTime : gameState.lastInputTime
    });
  };

  // 渲染游戏画面
  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制背景 - 使用纯色背景，不再使用背景图片
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线（用于调试）
    drawGrid(ctx, canvas.width, canvas.height);
    
    // 绘制玩家和敌人之间的连线，帮助查看目标
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    
    gameState.enemies.forEach(enemy => {
      // 绘制从玩家到敌人的连线
      ctx.beginPath();
      ctx.moveTo(gameState.player.x, gameState.player.y);
      ctx.lineTo(enemy.x, enemy.y);
      ctx.stroke();
      
      // 显示敌人坐标，帮助调试
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`(${Math.round(enemy.x)},${Math.round(enemy.y)})`, enemy.x, enemy.y - enemy.height);
    });

    // 绘制敌人
    gameState.enemies.forEach((enemy) => {
      // 绘制敌人外发光效果
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff3300';
      
      // 使用明亮的颜色绘制敌人，以增强可见性
      ctx.fillStyle = enemy.type === 'basic' ? '#ff3300' : '#ff9900';
      
      // 绘制敌人 - 放大敌人尺寸以使其更明显
      ctx.fillRect(
        enemy.x - enemy.width / 2,
        enemy.y - enemy.height / 2,
        enemy.width,
        enemy.height
      );
      
      // 添加敌人的轮廓线以增强可见性
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      ctx.strokeRect(
        enemy.x - enemy.width / 2,
        enemy.y - enemy.height / 2,
        enemy.width,
        enemy.height
      );
      
      // 重置阴影
      ctx.shadowBlur = 0;

      // 绘制敌人健康条
      const healthBarWidth = enemy.width;
      const healthBarHeight = 8;
      const healthPercentage = enemy.health / enemy.maxHealth;

      // 背景（灰色）
      ctx.fillStyle = 'rgba(50, 50, 50, 0.8)';
      ctx.fillRect(
        enemy.x - healthBarWidth / 2,
        enemy.y - enemy.height / 2 - 15,
        healthBarWidth,
        healthBarHeight
      );

      // 前景（红色）
      ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
      ctx.fillRect(
        enemy.x - healthBarWidth / 2,
        enemy.y - enemy.height / 2 - 15,
        healthBarWidth * healthPercentage,
        healthBarHeight
      );
    });

    // 绘制玩家
    // 添加玩家发光效果
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#00ff00';
    
    // 绘制玩家 - 使用明亮的颜色，增强可见性
    ctx.fillStyle = '#00ff00'; // 亮绿色
    ctx.fillRect(
      gameState.player.x - gameState.player.width / 2,
      gameState.player.y - gameState.player.height / 2,
      gameState.player.width,
      gameState.player.height
    );
    
    // 添加玩家轮廓
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeRect(
      gameState.player.x - gameState.player.width / 2,
      gameState.player.y - gameState.player.height / 2,
      gameState.player.width,
      gameState.player.height
    );
    
    // 重置阴影
    ctx.shadowBlur = 0;

    // 绘制UI
    drawUI(ctx);
    
    // 绘制调试信息
    drawDebugInfo(ctx);
  };

  // 绘制网格线函数（用于调试）
  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
    ctx.lineWidth = 0.5;

    // 绘制垂直线
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 绘制水平线
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  // 绘制调试信息
  const drawDebugInfo = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    
    // 基本信息
    ctx.fillText(`键盘状态: W:${keyState.w ? '✓' : '✗'} A:${keyState.a ? '✓' : '✗'} S:${keyState.s ? '✓' : '✗'} D:${keyState.d ? '✓' : '✗'}`, 20, canvas.height - 120);
    ctx.fillText(`玩家位置: (${Math.floor(gameState.player.x)}, ${Math.floor(gameState.player.y)})`, 20, canvas.height - 90);
    ctx.fillText(`敌人数量: ${gameState.enemies.length}`, 20, canvas.height - 60);
    ctx.fillText(`游戏时间: ${Math.floor(gameState.gameTime / 1000)}秒`, 20, canvas.height - 30);
    
    // 敌人详细信息（当敌人数量不为0时）
    if (gameState.enemies.length > 0) {
      ctx.textAlign = 'right';
      ctx.fillText('敌人信息:', canvas.width - 20, 30);
      
      gameState.enemies.forEach((enemy, index) => {
        if (index < 5) { // 最多显示5个敌人信息
          ctx.fillText(
            `敌人${index+1}: (${Math.floor(enemy.x)}, ${Math.floor(enemy.y)}) 类型:${enemy.type} 血量:${enemy.health}`,
            canvas.width - 20,
            60 + index * 25
          );
        }
      });
    }
  };

  // 添加绘制UI的函数
  const drawUI = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 经验条
    const expBarWidth = 300;
    const expBarHeight = 10;
    const expBarX = (canvas.width - expBarWidth) / 2;
    const expBarY = 20;
    
    // 背景
    ctx.fillStyle = '#333333';
    ctx.fillRect(expBarX, expBarY, expBarWidth, expBarHeight);

    // 经验值
    ctx.fillStyle = '#2ed573';
    const expPercent = Math.min(1, gameState.player.experience / gameState.player.experienceToNextLevel);
    ctx.fillRect(expBarX, expBarY, expBarWidth * expPercent, expBarHeight);

    // 等级和分数
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Level: ${gameState.player.level}`, expBarX, expBarY - 5);
    
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${gameState.score}`, expBarX + expBarWidth, expBarY - 5);

    // 计时器
    const minutes = Math.floor(gameState.gameTime / 60000);
    const seconds = Math.floor((gameState.gameTime % 60000) / 1000);
    ctx.textAlign = 'center';
    ctx.fillText(`Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`, canvas.width / 2, expBarY - 5);

    // 绘制玩家生命值条
    const healthBarWidth = 200;
    const healthBarHeight = 10;
    const healthBarX = (canvas.width - healthBarWidth) / 2;
    const healthBarY = canvas.height - 30;
    
    // 背景
    ctx.fillStyle = '#333333';
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);
    
    // 血量
    ctx.fillStyle = '#ff4757';
    const healthPercent = Math.max(0, gameState.player.health / gameState.player.maxHealth);
    ctx.fillRect(healthBarX, healthBarY, healthBarWidth * healthPercent, healthBarHeight);

    // 血量文本
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${Math.round(gameState.player.health)} / ${gameState.player.maxHealth}`,
      canvas.width / 2,
      healthBarY - 5
    );
  };

  // 处理升级选择
  const handleLevelUpChoice = (optionId: string) => {
    // 找到选中的选项
    const selectedOption = gameState.levelUpOptions.find(option => option.id === optionId);
    if (!selectedOption) return;
    
    // 按选项类型处理升级
    const weaponType = selectedOption.id.split('_')[0];
    
    // 检查是否已有该武器
    const existingWeaponIndex = gameState.activeWeapons.findIndex(w => w.type === weaponType);
    
    if (existingWeaponIndex >= 0) {
      // 升级现有武器
      const updatedWeapons = [...gameState.activeWeapons];
      const weapon = updatedWeapons[existingWeaponIndex];
      
      updatedWeapons[existingWeaponIndex] = {
        ...weapon,
        level: weapon.level + 1,
        damage: weapon.damage * 1.2,
        projectileCount: weapon.type === 'spread' ? weapon.projectileCount + 1 : weapon.projectileCount,
        projectileSpread: weapon.type === 'spread' ? weapon.projectileSpread + 5 : weapon.projectileSpread,
        fireRate: weapon.fireRate * 0.9, // 提高射速
      };
      
      setGameState({
        ...gameState,
        showLevelUp: false,
        activeWeapons: updatedWeapons,
      });
    } else {
      // 添加新武器
      const newWeapon = {
        type: weaponType,
        level: 1,
        fireRate: getWeaponBaseFireRate(weaponType),
        lastFired: 0,
        damage: getWeaponBaseDamage(weaponType),
        speed: getWeaponBaseSpeed(weaponType),
        projectileCount: weaponType === 'spread' ? 3 : 1,
        projectileSpread: weaponType === 'spread' ? 30 : 0,
      };
      
      setGameState({
        ...gameState,
        showLevelUp: false,
        activeWeapons: [...gameState.activeWeapons, newWeapon],
      });
    }
  };

  // 生成升级选项
  const generateLevelUpOptions = (
    activeWeapons: GameState['activeWeapons'],
    weaponTypes: string[]
  ) => {
    const options = [];
    
    // 当前武器升级选项
    for (const weapon of activeWeapons) {
      if (weapon.level < 5) { // 最大等级为5
        options.push({
          id: `${weapon.type}_upgrade`,
          name: `Upgrade ${formatWeaponName(weapon.type)}`,
          description: `Increase ${formatWeaponName(weapon.type)} damage and effects`,
          icon: '⬆️',
        });
      }
    }
    
    // 新武器选项
    const availableWeapons = weaponTypes.filter(
      type => !activeWeapons.some(weapon => weapon.type === type)
    );
    
    for (let i = 0; i < Math.min(3 - options.length, availableWeapons.length); i++) {
      const randomIndex = Math.floor(Math.random() * availableWeapons.length);
      const weaponType = availableWeapons[randomIndex];
      
      options.push({
        id: `${weaponType}_new`,
        name: `New: ${formatWeaponName(weaponType)}`,
        description: getWeaponDescription(weaponType),
        icon: '🔫',
      });
      
      availableWeapons.splice(randomIndex, 1);
    }
    
    // 如果没有足够的选项，添加通用升级
    while (options.length < 3) {
      options.push({
        id: 'health_boost',
        name: 'Health Boost',
        description: 'Increase maximum health by 20%',
        icon: '❤️',
      });
      break;
    }
    
    return options;
  };

  // 辅助函数
  const formatWeaponName = (type: string) => {
    const names: Record<string, string> = {
      'basic': 'Basic Shot',
      'spread': 'Spread Shot',
      'piercing': 'Piercing Shot',
      'homing': 'Homing Shot',
      'explosive': 'Explosive Shot',
    };
    
    return names[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getWeaponDescription = (type: string) => {
    const descriptions: Record<string, string> = {
      'basic': 'A simple but effective shot',
      'spread': 'Fires multiple projectiles in a spread pattern',
      'piercing': 'Shots pass through enemies',
      'homing': 'Projectiles track nearby enemies',
      'explosive': 'Creates an explosion on impact',
    };
    
    return descriptions[type] || 'Unknown weapon';
  };

  const getWeaponColor = (type: string) => {
    const colors: Record<string, string> = {
      'basic': '#ffa502',
      'spread': '#1e90ff',
      'piercing': '#f368e0',
      'homing': '#2ed573',
      'explosive': '#ff4757',
    };
    
    return colors[type] || '#ffffff';
  };

  const getWeaponBaseFireRate = (type: string) => {
    const rates: Record<string, number> = {
      'basic': 400,
      'spread': 800,
      'piercing': 1000,
      'homing': 1200,
      'explosive': 1500,
    };
    
    return rates[type] || 500;
  };

  const getWeaponBaseDamage = (type: string) => {
    const damages: Record<string, number> = {
      'basic': 10,
      'spread': 5,
      'piercing': 15,
      'homing': 20,
      'explosive': 30,
    };
    
    return damages[type] || 10;
  };

  const getWeaponBaseSpeed = (type: string) => {
    const speeds: Record<string, number> = {
      'basic': 5,
      'spread': 4,
      'piercing': 6,
      'homing': 3,
      'explosive': 3,
    };
    
    return speeds[type] || 5;
  };

  // 重启游戏
  const restartGame = () => {
    setGameState({
      player: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        width: 60,
        height: 60,
        speed: 8,
        health: 100,
        maxHealth: 100,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
      },
      bullets: [],
      enemies: [],
      pickups: [],
      gameTime: 0,
      score: 0,
      isGameOver: false,
      isPaused: false,
      showLevelUp: false,
      levelUpOptions: [],
      weaponTypes: ['basic', 'spread', 'piercing', 'homing', 'explosive'],
      activeWeapons: [
        {
          type: 'basic',
          level: 1,
          fireRate: 500,
          lastFired: 0,
          damage: 10,
          speed: 8,
          projectileCount: 1,
          projectileSpread: 0,
        },
      ],
      lastInputTime: 0,
    });
  };

  // 使用游戏循环
  useGameLoop(updateGame, renderGame);

  return (
    <div className="survivor-game-container">
      <div className="game-info">
        <div>Health: {gameState.player.health}</div>
        <div>Score: {gameState.score}</div>
        <div className="debug-info">
          Position: ({gameState.player.x.toFixed(1)}, {gameState.player.y.toFixed(1)})
          <br />
          Keys: {Object.entries(keyState).filter(([_, pressed]) => pressed).map(([key]) => key).join(', ') || 'None'}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        tabIndex={0}
        onFocus={() => console.log('Canvas已获得焦点')}
        onClick={() => {
          // 点击时获取焦点以确保键盘事件的正常处理
          canvasRef.current?.focus();
          console.log('Canvas被点击，已获取焦点');
        }}
      />
      <div className="game-controls">
        <h3>控制说明:</h3>
        <p>使用 WASD 或方向键控制角色移动</p>
        <p>自动向最近的敌人射击</p>
        <button 
          onClick={() => {
            setKeyState(prev => ({ ...prev, w: true }));
            setTimeout(() => {
              setKeyState(prev => ({ ...prev, w: false }));
            }, 1000);
            console.log('测试向上移动按钮被点击');
          }} 
          className="test-button"
        >
          测试向上移动
        </button>
      </div>
      
      {/* 游戏结束UI */}
      {gameState.isGameOver && (
        <div className="game-over-screen">
          <h2>Game Over</h2>
          <p>Score: {gameState.score}</p>
          <p>Time: {Math.floor(gameState.gameTime / 60000)}:{Math.floor((gameState.gameTime % 60000) / 1000) < 10 ? '0' : ''}{Math.floor((gameState.gameTime % 60000) / 1000)}</p>
          <button className="restart-btn" onClick={restartGame}>Play Again</button>
        </div>
      )}
      
      {/* 升级选择UI */}
      {gameState.showLevelUp && (
        <div className="level-up-screen">
          <h2>Level Up!</h2>
          <p>Choose an upgrade:</p>
          <div className="level-up-options">
            {gameState.levelUpOptions.map(option => (
              <div
                key={option.id}
                className="level-up-option"
                onClick={() => handleLevelUpChoice(option.id)}
              >
                <div className="option-icon">{option.icon}</div>
                <h3>{option.name}</h3>
                <p>{option.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SurvivorGame; 
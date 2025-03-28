import React, { useRef, useEffect, useState } from 'react';
// @ts-ignore 忽略模块导入错误
import useGameLoop from '../../hooks/useGameLoop';
import './SurvivorGame.css';

// 资源路径
const playerImagePath = '/assets/images/survivor/player.png';
const bulletEffectsPath = '/assets/images/survivor/bullet_effects.png';

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
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      console.log(`Canvas尺寸已调整为: ${canvas.width}x${canvas.height}`);
      
      // 在尺寸变化后尝试重新渲染（不依赖于gameLoop）
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 简单绘制一个背景，确保画布尺寸正确
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制debug信息
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Canvas: ${canvas.width} x ${canvas.height}`, canvas.width / 2, canvas.height / 2);
      }
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
    const moveSpeed = gameState.player.speed;

    // 强制打印当前键盘状态，帮助调试
    console.log("键盘状态:", keyState, "位置:", playerX, playerY);

    // 使用键盘状态更新玩家位置
    const diagonalMovement = (keyState.w || keyState.s) && (keyState.a || keyState.d);
    const diagonalFactor = diagonalMovement ? 0.7071 : 1; // 约等于 1/sqrt(2)，对角线移动时的速度调整
    
    if (keyState.w) {
      playerY -= moveSpeed * diagonalFactor;
      console.log('玩家向上移动', {playerY, moveSpeed});
    }
    if (keyState.s) {
      playerY += moveSpeed * diagonalFactor;
      console.log('玩家向下移动', {playerY, moveSpeed});
    }
    if (keyState.a) {
      playerX -= moveSpeed * diagonalFactor;
      console.log('玩家向左移动', {playerX, moveSpeed});
    }
    if (keyState.d) {
      playerX += moveSpeed * diagonalFactor;
      console.log('玩家向右移动', {playerX, moveSpeed});
    }

    // 手动触发键盘调试 - 如果30秒内没有输入，自动模拟向右移动
    if (updatedGameTime > 2000 && updatedGameTime % 3000 < normalizedDeltaTime) {
      console.log("尝试模拟键盘输入: D键");
      // 临时测试：模拟按键
      playerX += 50;
    }

    // 限制玩家在画布内
    const canvasWidth = window.innerWidth;
    const canvasHeight = window.innerHeight;
    playerX = Math.max(gameState.player.width / 2, Math.min(playerX, canvasWidth - gameState.player.width / 2));
    playerY = Math.max(gameState.player.height / 2, Math.min(playerY, canvasHeight - gameState.player.height / 2));

    // 生成敌人
    let updatedEnemies = [...gameState.enemies];
    
    // 增加敌人生成速率，每秒最多生成3个敌人
    const enemySpawnRate = 1000 / Math.min(3, 1 + Math.floor(updatedGameTime / 10000));
    
    // 如果距离上次生成敌人的时间大于生成速率，则生成新敌人
    if (updatedGameTime % enemySpawnRate < normalizedDeltaTime || updatedEnemies.length === 0) {
      console.log('生成敌人');
      const spawnEdge = Math.floor(Math.random() * 4); // 0: 上, 1: 右, 2: 下, 3: 左
      let enemyX = 0;
      let enemyY = 0;
      
      // 可视区域偏移量，确保生成在屏幕边缘稍微外一点
      const offset = 100;
      
      switch (spawnEdge) {
        case 0: // 上
          enemyX = Math.random() * canvasWidth;
          enemyY = -offset;
          break;
        case 1: // 右
          enemyX = canvasWidth + offset;
          enemyY = Math.random() * canvasHeight;
          break;
        case 2: // 下
          enemyX = Math.random() * canvasWidth;
          enemyY = canvasHeight + offset;
          break;
        case 3: // 左
          enemyX = -offset;
          enemyY = Math.random() * canvasHeight;
          break;
      }
      
      // 敌人类型随时间变化
      const enemyTypes = ['basic'];
      if (updatedGameTime > 60000) enemyTypes.push('fast');
      if (updatedGameTime > 120000) enemyTypes.push('tank');
      
      const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      
      // 敌人属性根据类型定义 - 增大敌人尺寸和增加伤害
      let enemyHealth = 30;
      let enemySpeed = 2;  // 增加基础速度
      let enemyDamage = 10;
      let experienceValue = 10;
      let enemyWidth = 40;  // 增大敌人尺寸
      let enemyHeight = 40;
      
      if (enemyType === 'fast') {
        enemyHealth = 20;
        enemySpeed = 3;  // 更快的速度
        enemyDamage = 5;
        experienceValue = 15;
        enemyWidth = 30;  // 较小但更快
        enemyHeight = 30;
      } else if (enemyType === 'tank') {
        enemyHealth = 100;
        enemySpeed = 1;
        enemyDamage = 20;
        experienceValue = 30;
        enemyWidth = 50;  // 更大更强
        enemyHeight = 50;
      }
      
      updatedEnemies.push({
        id: Date.now() + Math.random(),
        x: enemyX,
        y: enemyY,
        width: enemyWidth,
        height: enemyHeight,
        health: enemyHealth,
        maxHealth: enemyHealth,
        speed: enemySpeed,
        damage: enemyDamage,
        type: enemyType,
        experienceValue,
      });
    }

    // 更新敌人位置和行为
    updatedEnemies = updatedEnemies.map(enemy => {
      // 计算朝向玩家的方向
      const dx = playerX - enemy.x;
      const dy = playerY - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 归一化方向向量
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      
      // 更新敌人位置
      return {
        ...enemy,
        x: enemy.x + normalizedDx * enemy.speed * (normalizedDeltaTime / 16),
        y: enemy.y + normalizedDy * enemy.speed * (normalizedDeltaTime / 16),
      };
    });

    // 发射子弹
    let updatedBullets = [...gameState.bullets];
    
    // 对每个武器
    const updatedActiveWeapons = gameState.activeWeapons.map(weapon => {
      const currentTime = updatedGameTime;
      
      // 检查武器是否可以发射
      if (currentTime - weapon.lastFired >= weapon.fireRate) {
        console.log('尝试发射子弹');
        
        // 修改发射逻辑，不需要敌人也能发射子弹
        // 如果有敌人，瞄准最近的敌人；如果没有敌人，朝鼠标方向或固定方向发射
        let targetX = playerX;
        let targetY = playerY - 100; // 默认朝上发射
        
        // 找到最近的敌人
        if (updatedEnemies.length > 0) {
          let closestEnemy = null;
          let closestDistance = Infinity;
          
          for (const enemy of updatedEnemies) {
            const dx = enemy.x - playerX;
            const dy = enemy.y - playerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < closestDistance) {
              closestDistance = distance;
              closestEnemy = enemy;
            }
          }
          
          if (closestEnemy) {
            targetX = closestEnemy.x;
            targetY = closestEnemy.y;
          }
        }
        
        // 根据武器类型创建子弹
        for (let i = 0; i < weapon.projectileCount; i++) {
          // 计算子弹方向
          let angle = Math.atan2(targetY - playerY, targetX - playerX);
          
          // 如果有扩散，添加随机角度
          if (weapon.projectileSpread > 0) {
            angle += (Math.random() - 0.5) * weapon.projectileSpread * Math.PI / 180;
          }
          
          // 增大子弹半径
          const bulletRadius = 8; // 比之前的5更大
          
          updatedBullets.push({
            id: Date.now() + Math.random(),
            x: playerX,
            y: playerY,
            targetX: playerX + Math.cos(angle) * 1000, // 目标点
            targetY: playerY + Math.sin(angle) * 1000,
            speed: weapon.speed,
            damage: weapon.damage,
            radius: bulletRadius,
            color: getWeaponColor(weapon.type),
            type: weapon.type,
          });
          
          // 添加射击效果（视觉反馈）
          // 可以在这里添加声音或其他视觉效果
        }
        
        return {
          ...weapon,
          lastFired: currentTime,
        };
      }
      
      return weapon;
    });

    // 更新子弹位置
    updatedBullets = updatedBullets.map(bullet => {
      // 计算朝向目标的方向
      const dx = bullet.targetX - bullet.x;
      const dy = bullet.targetY - bullet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 归一化方向向量
      const normalizedDx = dx / distance;
      const normalizedDy = dy / distance;
      
      // 更新子弹位置 - 使用deltaTime标准化速度
      return {
        ...bullet,
        x: bullet.x + normalizedDx * bullet.speed * (normalizedDeltaTime / 16),
        y: bullet.y + normalizedDy * bullet.speed * (normalizedDeltaTime / 16),
      };
    });

    // 移除超出范围的子弹
    updatedBullets = updatedBullets.filter(bullet => {
      return bullet.x > -100 && bullet.x < window.innerWidth + 100 &&
             bullet.y > -100 && bullet.y < window.innerHeight + 100;
    });

    // 检测子弹与敌人的碰撞
    let updatedPickups = [...gameState.pickups];
    let updatedScore = gameState.score;
    let updatedPlayerExperience = gameState.player.experience;
    
    for (let i = updatedBullets.length - 1; i >= 0; i--) {
      const bullet = updatedBullets[i];
      
      for (let j = updatedEnemies.length - 1; j >= 0; j--) {
        const enemy = updatedEnemies[j];
        
        // 简单的矩形碰撞检测
        const bulletLeft = bullet.x - bullet.radius;
        const bulletRight = bullet.x + bullet.radius;
        const bulletTop = bullet.y - bullet.radius;
        const bulletBottom = bullet.y + bullet.radius;
        
        const enemyLeft = enemy.x - enemy.width / 2;
        const enemyRight = enemy.x + enemy.width / 2;
        const enemyTop = enemy.y - enemy.height / 2;
        const enemyBottom = enemy.y + enemy.height / 2;
        
        if (bulletRight > enemyLeft && bulletLeft < enemyRight &&
            bulletBottom > enemyTop && bulletTop < enemyBottom) {
          
          // 减少敌人生命值
          updatedEnemies[j] = {
            ...enemy,
            health: enemy.health - bullet.damage,
          };
          
          // 移除子弹，除非是穿透型
          if (bullet.type !== 'piercing') {
            updatedBullets.splice(i, 1);
          }
          
          // 如果敌人被杀死
          if (updatedEnemies[j].health <= 0) {
            // 生成经验值掉落
            updatedPickups.push({
              id: Date.now() + Math.random(),
              x: enemy.x,
              y: enemy.y,
              radius: 10,
              type: 'experience',
              value: enemy.experienceValue,
            });
            
            updatedScore += enemy.experienceValue;
            updatedEnemies.splice(j, 1);
          }
          
          break;
        }
      }
    }

    // 检测玩家与敌人的碰撞
    let updatedPlayerHealth = gameState.player.health;
    
    for (let i = updatedEnemies.length - 1; i >= 0; i--) {
      const enemy = updatedEnemies[i];
      
      // 简单的矩形碰撞检测
      const playerLeft = playerX - gameState.player.width / 2;
      const playerRight = playerX + gameState.player.width / 2;
      const playerTop = playerY - gameState.player.height / 2;
      const playerBottom = playerY + gameState.player.height / 2;
      
      const enemyLeft = enemy.x - enemy.width / 2;
      const enemyRight = enemy.x + enemy.width / 2;
      const enemyTop = enemy.y - enemy.height / 2;
      const enemyBottom = enemy.y + enemy.height / 2;
      
      if (playerRight > enemyLeft && playerLeft < enemyRight &&
          playerBottom > enemyTop && playerTop < enemyBottom) {
        
        // 玩家受到伤害
        updatedPlayerHealth -= enemy.damage * normalizedDeltaTime / 1000;
      }
    }

    // 检测玩家与掉落物的碰撞
    for (let i = updatedPickups.length - 1; i >= 0; i--) {
      const pickup = updatedPickups[i];
      
      // 计算距离
      const dx = playerX - pickup.x;
      const dy = playerY - pickup.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // 吸收范围 (玩家大小 + 掉落物大小 + 额外范围)
      const pickupRange = gameState.player.width / 2 + pickup.radius + 20;
      
      if (distance < pickupRange) {
        // 根据掉落物类型处理
        if (pickup.type === 'experience') {
          updatedPlayerExperience += pickup.value;
        }
        
        updatedPickups.splice(i, 1);
      }
    }

    // 检查玩家是否升级
    let updatedPlayerLevel = gameState.player.level;
    let updatedExperienceToNextLevel = gameState.player.experienceToNextLevel;
    let updatedShowLevelUp = gameState.showLevelUp;
    let updatedLevelUpOptions = gameState.levelUpOptions;
    
    if (updatedPlayerExperience >= updatedExperienceToNextLevel) {
      updatedPlayerLevel += 1;
      updatedPlayerExperience -= updatedExperienceToNextLevel;
      updatedExperienceToNextLevel = Math.floor(100 * Math.pow(1.2, updatedPlayerLevel - 1));
      updatedShowLevelUp = true;
      
      // 生成升级选项
      updatedLevelUpOptions = generateLevelUpOptions(gameState.activeWeapons, gameState.weaponTypes);
    }

    // 检查游戏是否结束
    const updatedIsGameOver = updatedPlayerHealth <= 0;

    // 更新游戏状态
    setGameState({
      ...gameState,
      player: {
        ...gameState.player,
        x: playerX,
        y: playerY,
        health: updatedPlayerHealth,
        level: updatedPlayerLevel,
        experience: updatedPlayerExperience,
        experienceToNextLevel: updatedExperienceToNextLevel,
      },
      bullets: updatedBullets,
      enemies: updatedEnemies,
      pickups: updatedPickups,
      gameTime: updatedGameTime,
      score: updatedScore,
      isGameOver: updatedIsGameOver,
      showLevelUp: updatedShowLevelUp,
      levelUpOptions: updatedLevelUpOptions,
      activeWeapons: updatedActiveWeapons,
    });
  };

  // 渲染游戏画面
  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // 用于FPS计算的deltaTime变量
    const deltaTime = 16; // 默认约60fps
    
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 调试模式：绘制网格线和游戏信息
    const debugMode = true; // 默认开启调试模式
    
    // 绘制背景 - 使用纯色背景，不再使用背景图片
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (debugMode) {
      drawGrid(ctx, canvas.width, canvas.height);
      drawFPS(ctx, deltaTime);
      
      // 绘制玩家和敌人之间的连线，帮助查看目标
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      
      gameState.enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.moveTo(gameState.player.x, gameState.player.y);
        ctx.lineTo(enemy.x, enemy.y);
        ctx.stroke();
        
        // 在敌人位置显示坐标
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`(${Math.round(enemy.x)},${Math.round(enemy.y)})`, enemy.x, enemy.y - enemy.height);
      });
    }

    // 绘制敌人
    gameState.enemies.forEach((enemy) => {
      // 绘制敌人图像 - 使用更鲜艳的颜色和更大的尺寸
      let enemyColor;
      switch(enemy.type) {
        case 'basic':
          enemyColor = '#ff0000'; // 亮红色
          break;
        case 'fast':
          enemyColor = '#00ffff'; // 青色
          break;
        case 'tank':
          enemyColor = '#ff9900'; // 橙色
          break;
        default:
          enemyColor = '#ff00ff'; // 品红色
      }
      
      // 绘制敌人外发光效果
      ctx.shadowBlur = 10;
      ctx.shadowColor = enemyColor;
      
      // 绘制敌人
      ctx.fillStyle = enemyColor;
      ctx.fillRect(
        enemy.x - enemy.width / 2,
        enemy.y - enemy.height / 2,
        enemy.width,
        enemy.height
      );
      
      // 重置阴影
      ctx.shadowBlur = 0;

      // 添加敌人的轮廓线
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        enemy.x - enemy.width / 2,
        enemy.y - enemy.height / 2,
        enemy.width,
        enemy.height
      );

      // 绘制敌人健康条
      const healthBarWidth = enemy.width;
      const healthBarHeight = 5;
      const healthPercentage = enemy.health / enemy.maxHealth;

      // 背景（灰色）
      ctx.fillStyle = 'gray';
      ctx.fillRect(
        enemy.x - healthBarWidth / 2,
        enemy.y - enemy.height / 2 - 10,
        healthBarWidth,
        healthBarHeight
      );

      // 前景（红色）
      ctx.fillStyle = 'red';
      ctx.fillRect(
        enemy.x - healthBarWidth / 2,
        enemy.y - enemy.height / 2 - 10,
        healthBarWidth * healthPercentage,
        healthBarHeight
      );
    });

    // 绘制子弹
    gameState.bullets.forEach((bullet) => {
      // 子弹发光效果
      ctx.shadowBlur = 15;
      ctx.shadowColor = bullet.color;
      
      // 绘制子弹 - 增大尺寸并添加外发光
      ctx.beginPath();
      ctx.arc(bullet.x, bullet.y, bullet.radius * 2, 0, Math.PI * 2);
      ctx.fillStyle = bullet.color;
      ctx.fill();
      
      // 添加白色边缘增强可见性
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 重置阴影
      ctx.shadowBlur = 0;
      
      // 添加子弹尾迹
      ctx.globalAlpha = 0.6;
      const dx = bullet.targetX - bullet.x;
      const dy = bullet.targetY - bullet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const normalizedDx = distance ? dx / distance : 0;
      const normalizedDy = distance ? dy / distance : 0;
      
      ctx.beginPath();
      ctx.moveTo(bullet.x, bullet.y);
      ctx.lineTo(
        bullet.x - normalizedDx * bullet.radius * 6,
        bullet.y - normalizedDy * bullet.radius * 6
      );
      ctx.lineWidth = bullet.radius;
      ctx.strokeStyle = bullet.color;
      ctx.stroke();
      
      ctx.globalAlpha = 1.0;
    });

    // 绘制玩家
    // 给玩家添加发光效果
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#4CAF50';
    
    if (playerImageRef.current) {
      ctx.drawImage(
        playerImageRef.current,
        gameState.player.x - gameState.player.width / 2,
        gameState.player.y - gameState.player.height / 2,
        gameState.player.width,
        gameState.player.height
      );
    } else {
      // 玩家使用更明亮的颜色
      ctx.fillStyle = '#4CAF50'; // 亮绿色
      ctx.fillRect(
        gameState.player.x - gameState.player.width / 2,
        gameState.player.y - gameState.player.height / 2,
        gameState.player.width,
        gameState.player.height
      );
      
      // 添加轮廓以增强可见性
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        gameState.player.x - gameState.player.width / 2,
        gameState.player.y - gameState.player.height / 2,
        gameState.player.width,
        gameState.player.height
      );
    }
    
    // 重置阴影
    ctx.shadowBlur = 0;

    // 绘制拾取物
    gameState.pickups.forEach((pickup) => {
      ctx.beginPath();
      ctx.arc(pickup.x, pickup.y, pickup.radius, 0, Math.PI * 2);
      ctx.fillStyle = pickup.type === 'health' ? 'red' : 'yellow';
      ctx.fill();
    });

    // 绘制UI
    drawUI(ctx);
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

  // 绘制FPS（用于调试）
  const drawFPS = (ctx: CanvasRenderingContext2D, deltaTime: number) => {
    const fps = deltaTime ? Math.round(1000 / deltaTime) : 0;
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`FPS: ${fps}`, 10, 20);
    ctx.fillText(`Player: (${Math.round(gameState.player.x)}, ${Math.round(gameState.player.y)})`, 10, 40);
    ctx.fillText(`Enemies: ${gameState.enemies.length}`, 10, 60);
    ctx.fillText(`Bullets: ${gameState.bullets.length}`, 10, 80);
    ctx.fillText(`Score: ${gameState.score}`, 10, 100);
    
    // 添加键盘状态显示，帮助调试
    ctx.fillText(`Keys: ${keyState.w ? 'W' : ''} ${keyState.a ? 'A' : ''} ${keyState.s ? 'S' : ''} ${keyState.d ? 'D' : ''}`, 10, 120);
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
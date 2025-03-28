import React, { useEffect, useRef } from 'react';
import { GameLoop } from './GameLoop';
import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { GameEntity, Size, Vector2 } from '../utils/types';

export const SurvivorGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEntitiesRef = useRef<GameEntity[]>([]);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size to full screen
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize game entities
    const playerSize: Size = { width: 32, height: 32 };
    const playerPosition: Vector2 = {
      x: canvas.width / 2,
      y: canvas.height / 2
    };
    const player = new Player(playerPosition, playerSize);
    playerRef.current = player;
    gameEntitiesRef.current = [player];

    // Enemy spawning function
    const spawnEnemy = () => {
      const enemySize: Size = { width: 24, height: 24 };
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
      let enemyPosition: Vector2;

      switch (side) {
        case 0: // top
          enemyPosition = {
            x: Math.random() * canvas.width,
            y: -enemySize.height
          };
          break;
        case 1: // right
          enemyPosition = {
            x: canvas.width + enemySize.width,
            y: Math.random() * canvas.height
          };
          break;
        case 2: // bottom
          enemyPosition = {
            x: Math.random() * canvas.width,
            y: canvas.height + enemySize.height
          };
          break;
        default: // left
          enemyPosition = {
            x: -enemySize.width,
            y: Math.random() * canvas.height
          };
          break;
      }

      const enemy = new Enemy(enemyPosition, enemySize);
      enemy.setTarget(player);
      gameEntitiesRef.current.push(enemy);
    };

    // Set up game loop
    const gameLoop = GameLoop.getInstance();
    const context = canvas.getContext('2d');

    if (!context) return;

    const update = (deltaTime: number) => {
      // Update all entities
      gameEntitiesRef.current.forEach(entity => entity.update(deltaTime));
    };

    const render = () => {
      if (!context) return;

      // Clear canvas
      context.fillStyle = 'black';
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Render all entities
      gameEntitiesRef.current.forEach(entity => entity.render(context));

      // Debug info
      context.fillStyle = 'white';
      context.font = '16px Arial';
      context.fillText(`Entities: ${gameEntitiesRef.current.length}`, 10, 20);
    };

    gameLoop.setCallbacks(update, render);
    gameLoop.start();

    // Start spawning enemies
    const spawnInterval = setInterval(spawnEnemy, 2000);

    return () => {
      gameLoop.stop();
      clearInterval(spawnInterval);
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black'
      }}
    />
  );
}; 
import { useRef, useEffect } from 'react';

/**
 * 自定义Hook，用于创建游戏循环
 * @param update 游戏更新函数，每帧调用，接收deltaTime参数
 * @param render 游戏渲染函数，每帧调用
 */
const useGameLoop = (
  update: (deltaTime: number) => void,
  render: () => void
) => {
  // 上一帧的时间戳
  const lastTimeRef = useRef<number>(0);
  // 动画帧请求ID
  const requestIdRef = useRef<number>(0);

  // 游戏主循环
  const loop = (timestamp: number) => {
    // 计算两帧之间的时间差（毫秒）
    const deltaTime = lastTimeRef.current ? timestamp - lastTimeRef.current : 0;
    lastTimeRef.current = timestamp;

    // 更新游戏逻辑
    update(deltaTime);
    
    // 渲染游戏画面
    render();

    // 请求下一帧
    requestIdRef.current = requestAnimationFrame(loop);
  };

  // 组件挂载时启动游戏循环，卸载时停止
  useEffect(() => {
    // 开始游戏循环
    requestIdRef.current = requestAnimationFrame(loop);

    // 清理：组件卸载时取消动画帧请求
    return () => {
      cancelAnimationFrame(requestIdRef.current);
    };
  }, []);
};

export default useGameLoop; 
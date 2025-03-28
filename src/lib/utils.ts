/**
 * 获取应用的基础路径
 * 根据部署环境返回适当的路径前缀
 */
export function getBasePath(): string {
  // 当部署到GitHub Pages或其他非根路径时，需要添加前缀
  // 本地开发时基路径为'/'，GitHub Pages上为'/web-game-practice/'
  return process.env.NODE_ENV === 'production' 
    ? '/web-game-practice/' 
    : '/';
} 
set -e
git pull
echo '开始拉取代码'
cnpm i
echo '模块依赖安装完成'
npm run pm2
echo '启动pm2'

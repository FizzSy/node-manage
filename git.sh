set -e
git pull
echo '开始拉取代码'
git add .
echo '添加修改文件'
git commit -m 'commit'
echo '提交代码'
git push
echo 'push'

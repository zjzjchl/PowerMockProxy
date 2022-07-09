echo ${1}
echo ${2}
# 复制文件
cp -rf ${1} ${2}
# 关闭服务
PID=$(pgrep powermock)
echo "current pid : ${PID}"
if [ -n "${PID}" ];then 
    echo "powermock existed, stop powermock server then restart it!"
    kill ${PID}
else
    echo "powermock is not existed, just start powermock server!"
fi
# 开启服务
cd /root/example
pwd
powermock-v8-linux-amd64 serve --config.file config.yaml &

# 查看新启用的powermock进程
PID=$(pgrep powermock)
echo "new pic : ${PID}"

# 重新载入所有的api


echo 'pileline finished!'

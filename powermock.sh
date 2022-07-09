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
echo "new pid : ${PID}"

# 重新载入所有的api
cd /root/PowerMockProxy/public/resources/
pwd
FILES=$(ls ./)
for FILE in ${FILES}
do
  if [ -d "${FILE}" ];then
    YAMLS=$(ls ./${FILE}/)
    for YAML in ${YAMLS}
    do
      if [ -f "./${FILE}/${YAML}" ];then
        SUFFIX="${YAML##*.}"
        if [ "${SUFFIX}" = "yaml" ];then
          echo ./${FILE}/${YAML}
          powermock-v8-linux-amd64 load --address=127.0.0.1:30000 ./${FILE}/${YAML}
        fi
      fi
    done
  fi
done


echo 'pileline finished!'

ProcessName="/usr/bin/serve"
kill $(ps aux | grep $ProcessName | awk '{print $2}')

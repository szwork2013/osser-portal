#sails lift --prod --port 8081
#forever start app.js --prod --port 8081
#pm2 start server-pm2.json

if [ $# != 1 ];then
    echo "*****dev mode*****"
    pm2 start server-pm2-dev.json
else
    if [ $1 = "prod" ] ; then
        echo "=====prod mode====="
        pm2 start server-pm2.json
    else
        echo "*****dev mode*****"
        pm2 start server-pm2-dev.json
    fi
fi

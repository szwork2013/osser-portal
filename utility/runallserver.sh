cd ../account
./runserver.sh prod
sleep 5

cd ../jsonapi
./runserver.sh prod
sleep 5

cd ../nodejs
./runserver.sh prod
sleep 5

cd ../osser
./runserver.sh prod
sleep 5

cd ../redirect
./runserver.sh prod

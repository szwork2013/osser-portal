# sample:
# ./runallserver.sh prod
# or
# ./runallserver.sh

cd ../account
./runserver.sh $1
sleep 5

cd ../jsonapi
./runserver.sh $1
sleep 5

cd ../nodejs
./runserver.sh $1
sleep 5

cd ../osser
./runserver.sh $1
sleep 5

cd ../redirect
./runserver.sh $1
sleep 5

#cd ../book
#./runserver.sh $1
#sleep 5

#cd ../tools
#./runserver.sh $1
#sleep 5

cd ../sample
./runserver.sh $1
sleep 5

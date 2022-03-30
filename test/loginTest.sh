for i in {1..100}
do
echo $i
curl -X 'POST' \
  'http://localhost:3000/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_name": "shivdutjakore@gmail.com",
  "password": "shivdut23"
}'
done
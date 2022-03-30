for i in {1..100}
do
echo $i
curl -X 'POST' \
  'http://localhost:3000/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "user_name": "krishnapoul@gmail.com",
  "password": "krish123",
  "role": "user"
}'
done
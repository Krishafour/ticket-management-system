for i in {1..100}
do
echo $i
curl -X 'GET' \
  'http://localhost:3000/ticketStatus' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMmVhODg3Y2QtODYwMS00M2RjLWIyNGQtY2NmMTVmY2NhMWJiIiwidXNlcl9uYW1lIjoic2hpdmR1dGpha29yZUBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTY0ODE5OTQ3NSwiZXhwIjoxNjQ4MjAxMjc1fQ.Qq8Ao152J1g-qZXpUuud3hgKtr6B_vYnzvVbXDtb2mg'
done
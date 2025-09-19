# Does cors "block" requests (i.e. prevent the request from getting to the route)?

curl -H "Origin: https://cristian.test" localhost:3000 -v
curl -H "Origin: https://cristian2.test" localhost:3000 -v

Both get a response, but only the first one reflects "Access-Control-Allow-Origin: https://cristian.test"
So no, it doesn't block.

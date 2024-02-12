load test

```bash
autocannon http://161.97.140.48:8080/api/get -m POST --header 'Content-Type: application/json' --body '{"table": "feedback","find": {}}' --connections 100 --duration 10 --pipelining 1 --renderStatusCodes
```
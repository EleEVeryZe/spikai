PORT=3000
if nc -zv localhost $PORT 2>/dev/null; then
    printf "Servidor rodando na porta %d\n" $PORT

    curl "http://localhost:3000/graphql" \
    -H "Content-Type: application/json" \
    --data-raw '{"query":"\n    query GetUserData($email: String!) {\n      userData(email: $email) {\n        id\n        nome\n      }\n    }","variables":{"email":"rodolfo@spkai.com"}}'
else
    echo "Nenhum socket escutando na porta $PORT"
fi

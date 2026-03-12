#!/bin/bash
#echo "Enqueue Ai Prompt"
#curl POST https://2qqqkwumjh.execute-api.sa-east-1.amazonaws.com/default/graphql -v \
#     -H "Content-type: application/json" \
#     --data '{"query":"mutation {\r\n  prompt(prompt: \"seu texto aqui\") {\r\n    jobId\r\n    status\r\n    message\r\n  }\r\n}","variables":{}}'

echo "Getting logs from AWS"
aws logs get-log-events \
    --log-group-name "/aws/lambda/user-module-dev" \

# This line prevents the window from closing
echo -e "\n\nPress Enter to close this window..."
read
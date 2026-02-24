import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ region: "sa-east-1" });

export async function getSsmSecret(parameterName: string): Promise<string> {
  const command = new GetParameterCommand({
    Name: parameterName,
    WithDecryption: true,
  });

  const response = await ssmClient.send(command);
  return response.Parameter?.Value || '';
}   
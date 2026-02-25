import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ region: "sa-east-1" });

const secretCache: Record<string, string> = {};

export async function getSsmSecret(parameterName: string): Promise<string> {
  if (process.env.ENVIRONMENT === "local") {
    const localMapping: Record<string, string | undefined> = {
      '/spkai/db/supabase': process.env.DATABASE_URL,
      '/spkai/dev/secret': process.env.SECRET,
    };
    return localMapping[parameterName] || "";
  }

  if (secretCache[parameterName]) {
    return secretCache[parameterName];
  }

  try {
    const command = new GetParameterCommand({
      Name: parameterName,
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);
    const value = response.Parameter?.Value || '';

    if (value) {
      secretCache[parameterName] = value;
    }

    return value;
  } catch (error) {
    console.error(`[SSM Error] Failed to fetch parameter: ${parameterName}`, error);
    throw error; 
  }
}   
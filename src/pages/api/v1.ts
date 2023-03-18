// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
  ) {
    const response = await callOpenAI(req);
    res.status(200).json(response);
  }


async function callOpenAI(req: NextApiRequest) {
  const OPENAI_API_KEY = process.env.OPEN_AI_API_KEY as string;  
  const OPENAI_ORG_ID = process.env.OPEN_AI_ORG_ID as string;
  const configuration = new Configuration({
    organization: OPENAI_ORG_ID,
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  console.log("3 [OPENAI - CreateChatCompletion] Request in progress: ", req.body.message);
  const messages = [{
    role: ChatCompletionRequestMessageRoleEnum.User,
    content: req.body.message,
  }]
  
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.1
  });
  return response.data;
}

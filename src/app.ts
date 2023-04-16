import axios from 'axios';
import nodejieba from 'nodejieba';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const { YUQUE_API_KEY } = process.env;

async function getYuqueDocument(slug, repo) {
  const response = await axios.get(
    `https://www.yuque.com/api/v2/repos/${repo}/docs/${slug}`,
    {
      headers: {
        'X-Auth-Token': YUQUE_API_KEY
      }
    }
  );

  return response.data.data.body;
}

function splitText(text) {
  const chunks = nodejieba.cut(text);
  return chunks;
}

// async function askQuestion(question, textChunks) {
//   const prompt = `问题：${question}\n答案：`;
//   const completions = await openai.createCompletion({
//     model: 'text-davinci-003',
//     prompt,
//     max_tokens: 1000
//   });

//   return completions.data.choices[0].text;
// }

async function askQuestion(question, textChunks) {
  const answers = [];

  for (const chunk of textChunks) {
    const prompt = `以下是文档的内容：
${chunk}
问题：${question}
答案：`;
    const completions = await openai.Completion.create({
      engine: 'text-davinci-002',
      prompt,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.8
    });

    const answer = completions.choices[0].text.trim();
    answers.push(answer);
  }

  return answers.join('\n');
}

async function main() {
  const slug = 'nd5ily0vbv4q000w';
  const repo = 'advance-zjpx5/efaxzx';

  const yuqueContent = await getYuqueDocument(slug, repo);
  const textChunks = splitText(yuqueContent);
  debugger;
  const question = '总结下这篇文章';

  const answer = await askQuestion(question, textChunks);

  console.log('答案：', answer);
}

main().catch(error => console.error(error));

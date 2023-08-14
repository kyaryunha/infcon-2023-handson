const { Configuration, OpenAIApi } = require("openai");
const { api_key } = require('../api_key');

const configuration = new Configuration({
    apiKey: api_key,
});
const openai = new OpenAIApi(configuration);

const main = async () => {
    const chat = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "user",
                "content": "GPT를 만든 회사 OpenAI에 대해 짧게 설명해 줘 "
            },
        ],
        max_tokens: 2000,
        temperature: 1,
        n: 1,
    });
    console.log(chat.data.choices[0].message.content);
};

main();
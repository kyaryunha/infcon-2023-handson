const { Configuration, OpenAIApi } = require("openai");
const { api_key } = require('../api_key');

const configuration = new Configuration({
    apiKey: api_key,
});
const openai = new OpenAIApi(configuration);

const input = () => new Promise((resolve, reject) => {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('user: ', (answer) => {
        resolve(answer);
        rl.close();
    });
});

const main = async () => {
    const messages = [{
        "role": "system",
        "content": "유저와 대화를 하는 챗봇입니다."
    }];
    while (true) {
        /// 입력 받기
        const content = await input();
        messages.push({
            "role": "user",
            "content": content
        });

        if (content === "exit") {
            break;
        }

        const chat = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "유저와 대화를 하는 챗봇입니다."
                },
                {
                    "role": "user",
                    "content": content
                },
            ],
            max_tokens: 2000,
            temperature: 1,
            n: 1,
        });
        console.log(chat.data.choices[0].message.content);
    }
};

main();
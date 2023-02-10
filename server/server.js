const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(express.json());
app.use(cors());

const openai = new OpenAIApi(configuration);
app.get("/", async (req, res) => {
    res.status(200).json({ message: "hello World !" });
});

app.post("/", async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prompt.toLowerCase(),
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({ bot: response.data.choices[0].text });
    } catch (error) {
        res.status(500).send({ error });
    }
});

app.listen(5000, () => {
    console.log("server started on port 5000");
});

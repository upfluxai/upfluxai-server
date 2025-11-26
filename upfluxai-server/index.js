import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/ia", async (req, res) => {
    try {
        const { prompt } = req.body;

        const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3-70b-8192",
                messages: [{ role: "user", content: prompt }]
            })
        });

        const data = await r.json();

        res.json({
            resposta: data.choices?.[0]?.message?.content || "Sem resposta da IA."
        });

    } catch (err) {
        res.status(500).json({ erro: err.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Servidor rodando na porta " + port));

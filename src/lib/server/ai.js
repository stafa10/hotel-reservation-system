import { OPENAI_API_KEY } from '$env/static/private';

export async function askAI(messages) {

    const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },

            body: JSON.stringify({

                model: "gpt-4.1-mini",

                messages,

                max_completion_tokens:600

            })

        }
    );

    const data = await response.json();

    if(!response.ok){

        throw new Error(data.error.message);

    }

    return data.choices[0].message.content;

}
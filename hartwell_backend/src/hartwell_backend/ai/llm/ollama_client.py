import ollama


class OllamaClient:
    """
    Thin wrapper around Ollama.

    Every AI service should use this class.
    """

    def __init__(self, model: str = "medgemma1.5:4b"):
        self.model = model

    def generate(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> str:
        response = ollama.chat(
            model=self.model,
            think=False,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": user_prompt,
                },
            ],
            options={
                "temperature": 0.2,
            },
        )

        response = response["message"]["content"]

        if "<unused95>" in response:
            response = response.split("<unused95>")[-1].strip()

        return response

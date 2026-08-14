import ollama


class OllamaClient:
    """
    Thin wrapper around Ollama.

    Every AI service should use this class.
    """
    def __init__(self, model: str = "medgemma1.5:4b"):
        self.model = model

    def generate(self, user_prompt: str, images: list = None, system_prompt: str = None) -> str:
        messages = [
            {
                "role": "user",
                "content": user_prompt,
                "images": images
            }
        ]
        
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
            
        response = ollama.chat(
            model=self.model,
            think=False,
            messages=messages,
            options={
                "temperature": 0.2,
            },
        )

        response = response["message"]["content"]

        if "<unused95>" in response:
            response = response.split("<unused95>")[-1].strip()

        return response

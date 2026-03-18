import gradio as gr
import os
from groq import Groq

# Get API Key from environment variable (Hugging Face Secret)
# You need to add GROQ_API_KEY in the "Settings > Variables and secrets" section of your Space
api_key = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=api_key)

SYSTEM_PROMPT = """
คุณคือเจ้าหน้าที่ฝ่ายบริการลูกค้า (Customer Support Agent)

หน้าที่ของคุณคือช่วยร่างอีเมลตอบกลับลูกค้าอย่างสุภาพ เป็นมืออาชีพ และกระชับ

แนวทางการตอบ:
- เริ่มต้นด้วยคำทักทาย เช่น "เรียน ลูกค้าที่เคารพ"
- ขอบคุณลูกค้าที่ติดต่อเข้ามา
- หากลูกค้ามีปัญหาให้กล่าวขออภัย
- ให้ข้อมูลหรือแนวทางแก้ไขปัญหา
- ใช้น้ำเสียงสุภาพและเป็นทางการ
- ปิดท้ายอีเมลด้วย

ขอแสดงความนับถือ
ฝ่ายบริการลูกค้า

ตอบเป็นภาษาไทยเท่านั้น
"""

def predict(prompt):
    if not api_key:
        return "Error: GROQ_API_KEY is not set in Hugging Face Secrets."
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant", # Updated from lama3-8b-8192
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

# Create Gradio interface
# naming the function 'predict' and using a simple textbox input/output
# makes it compatible with the backend call: app.predict("/predict", [prompt])
demo = gr.Interface(
    fn=predict,
    inputs=gr.Textbox(lines=10, label="Input Prompt"),
    outputs=gr.Textbox(label="AI Generated Reply"),
    title="AI Email Reply Assistant API",
    description="This is the AI server for the Email Reply Assistant project."
)

if __name__ == "__main__":
    demo.launch()

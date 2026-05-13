from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from groq import Groq
from dotenv import load_dotenv
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.pagesizes import letter

import os


# LOAD ENV

load_dotenv()


# FLASK APP

app = Flask(__name__)
CORS(app)


# GROQ CLIENT

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# AI CHAT API

@app.route('/ask-ai', methods=['POST'])
def ask_ai():

    data = request.json
    message = data.get("message")

    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        response = completion.choices[0].message.content

        return jsonify({
            "response": response
        })

    except Exception as e:
        return jsonify({
            "response": f"Error: {str(e)}"
        })



# GENERATE REPORT API

@app.route('/generate-report', methods=['POST'])
def generate_report():

    data = request.json
    issue = data.get("issue")

    prompt = f"""
Generate a detailed report about:

{issue}

Include:
1. Introduction
2. Explanation
3. Key Concepts
4. Advantages
5. Applications
6. Challenges
7. Future Scope
8. Conclusion

Give the report in proper paragraph format.
"""

    try:
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        report = completion.choices[0].message.content

        return jsonify({
            "report": report
        })

    except Exception as e:
        return jsonify({
            "report": f"Error: {str(e)}"
        })


# DOWNLOAD PDF API

@app.route('/download-report', methods=['POST'])
def download_report():

    data = request.json
    report = data.get("report")

    pdf_file = "audit_report.pdf"

    doc = SimpleDocTemplate(
        pdf_file,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    story = []

    paragraphs = report.split("\n")

    for para in paragraphs:
        if para.strip() != "":
            story.append(Paragraph(para, styles['BodyText']))
            story.append(Spacer(1, 12))

    doc.build(story)

    return send_file(
        pdf_file,
        as_attachment=True
    )



# MAIN

if __name__ == '__main__':
    app.run(debug=True)
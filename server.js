const fs = require("fs");
const pdf = require("pdf-parse");
const readline = require("readline");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

function chunkText(text, maxChunkSize = 20000) {
  const chunks = [];
  let start = 0;
  while (start < text.length) {
    const end = Math.min(start + maxChunkSize, text.length);
    chunks.push(text.slice(start, end));
    start = end;
  }
  return chunks;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the path to your PDF file: ", async (pdfPath) => {
  try {
    if (!fs.existsSync(pdfPath)) {
      console.log("❌ File not found. Please check the path.");
      rl.close();
      return;
    }

    const dataBuffer = fs.readFileSync(pdfPath);
    const pdfData = await pdf(dataBuffer);
    const fullText = pdfData.text;

    console.log(`✅ PDF loaded! Text length: ${fullText.length} characters.`);

    const chunks = chunkText(fullText, 20000);
    console.log(`📄 Total chunks created: ${chunks.length}`);

    rl.question("Enter your question about the PDF: ", async (userQuestion) => {
      if (!userQuestion.trim()) {
        console.log("❌ Please enter a valid question.");
        rl.close();
        return;
      }

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
      });
      let validAnswers = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        const prompt = `Here is part of a document:\n\n${chunk}\n\nQuestion: ${userQuestion}\n\nPlease answer the question based only on the text above. If the answer is not in this text, say "I cannot find that information in the document."`;

        try {
          const result = await model.generateContent(prompt);
          const answer = result.response.text().trim();

          if (
            !answer.toLowerCase().includes("i cannot find that information")
          ) {
            validAnswers.push({
              chunkIndex: i,
              answer: answer,
            });
          }
        } catch (err) {
          console.error("❌ Error with Gemini on a chunk:", err.message);
        }
      }

      if (validAnswers.length > 0) {
        console.log(
          `📝 Best Answer (from chunk ${validAnswers[0].chunkIndex + 1}):\n${
            validAnswers[0].answer
          }\n`
        );
      } else {
        console.log("🤖 Gemini couldn't find the answer in the document.");
      }

      rl.close();
    });
  } catch (err) {
    console.error("❌ Error reading PDF:", err.message);
    rl.close();
  }
});

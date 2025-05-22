// Simple PDF Chatbot with Claude AI - Beginner Version
// This code helps you upload a PDF and ask questions about it

// Step 1: Import the tools we need
const express = require("express"); // Creates web server
const multer = require("multer"); // Handles file uploads
const pdf = require("pdf-parse"); // Reads PDF files
const Anthropic = require("@anthropic-ai/sdk"); // Connects to Claude AI
const fs = require("fs"); // Works with files
require("dotenv").config(); // Loads secret keys from .env file

// Step 2: Create our web server
const app = express();
const port = 3000; // Server will run on localhost:3000

// Step 3: Connect to Claude AI
const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY, // Your secret API key
});

// Step 4: Set up file upload (where to save uploaded files)
const upload = multer({
  dest: "uploads/", // Save files in 'uploads' folder
  fileFilter: (req, file, callback) => {
    // Only allow PDF files
    if (file.mimetype === "application/pdf") {
      callback(null, true); // Accept the file
    } else {
      callback(new Error("Only PDF files allowed!"), false); // Reject the file
    }
  },
});

// Step 5: Set up server basics
app.use(express.json()); // Understand JSON data
app.use(express.static("public")); // Serve HTML files from 'public' folder

// Create uploads folder if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Step 6: Simple storage for our PDF content (like a notebook)
let myPDF = {
  filename: "",
  content: "",
  hasFile: false,
};

// ROUTE 1: Upload and read PDF file
app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    console.log("📁 Someone uploaded a file!");

    // Check if we got a file
    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded!" });
    }

    // Read the PDF file
    const fileData = fs.readFileSync(req.file.path);

    // Extract text from PDF (like copying text from a book)
    const pdfData = await pdf(fileData);
    const textFromPDF = pdfData.text;

    // Save the content in our simple storage
    myPDF.filename = req.file.originalname;
    myPDF.content = textFromPDF;
    myPDF.hasFile = true;

    // Clean up: delete the uploaded file (we already have the text)
    fs.unlinkSync(req.file.path);

    console.log("✅ PDF processed successfully!");
    console.log(`📄 File: ${myPDF.filename}`);
    console.log(`📝 Text length: ${textFromPDF.length} characters`);

    // Send success response
    res.json({
      success: true,
      message: "PDF uploaded successfully!",
      filename: myPDF.filename,
      textLength: textFromPDF.length,
    });
  } catch (error) {
    console.log("❌ Error:", error.message);
    res.json({ success: false, message: "Failed to process PDF" });
  }
});

// ROUTE 2: Ask questions about the PDF
app.post("/ask", async (req, res) => {
  try {
    const userQuestion = req.body.question;

    console.log("💭 Someone asked:", userQuestion);

    // Check if we have a PDF loaded
    if (!myPDF.hasFile) {
      return res.json({
        success: false,
        message: "Please upload a PDF first!",
      });
    }

    // Check if user asked a question
    if (!userQuestion) {
      return res.json({
        success: false,
        message: "Please ask a question!",
      });
    }

    // Prepare the message for Claude AI
    const messageForClaude = `Here is a document:

${myPDF.content}

Question: ${userQuestion}

Please answer the question based only on the document above. If the answer is not in the document, say "I cannot find that information in the document."`;

    console.log("🤖 Asking Claude AI...");

    // Ask Claude AI
    const response = await claude.messages.create({
      model: "claude-3-haiku-20240307", // Using fastest model for beginners
      max_tokens: 500, // Limit response length
      temperature: 0, // Make answers more precise
      messages: [
        {
          role: "user",
          content: messageForClaude,
        },
      ],
    });

    const answer = response.content[0].text;

    console.log("✅ Claude answered!");

    // Send the answer back
    res.json({
      success: true,
      question: userQuestion,
      answer: answer,
      filename: myPDF.filename,
    });
  } catch (error) {
    console.log("❌ Error asking Claude:", error.message);
    res.json({
      success: false,
      message: "Failed to get answer from AI",
    });
  }
});

// ROUTE 3: Check what PDF is loaded
app.get("/status", (req, res) => {
  res.json({
    hasFile: myPDF.hasFile,
    filename: myPDF.filename,
    textLength: myPDF.content.length,
  });
});

// ROUTE 4: Clear/reset everything
app.post("/clear", (req, res) => {
  myPDF.filename = "";
  myPDF.content = "";
  myPDF.hasFile = false;

  console.log("🗑️ Cleared all data");
  res.json({ success: true, message: "All data cleared!" });
});

// Start the server
app.listen(port, () => {
  console.log("🚀 PDF Chatbot is running!");
  console.log(`📍 Open your browser and go to: http://localhost:${port}`);
  console.log("💡 Make sure you have ANTHROPIC_API_KEY in your .env file");
  console.log("");
  console.log("How it works:");
  console.log("1. Upload a PDF file");
  console.log("2. Ask questions about it");
  console.log("3. Get answers from Claude AI");
});

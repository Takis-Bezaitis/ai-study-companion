# 📚 AI Study Companion

An AI-powered learning platform built with **React, TypeScript, Node.js, PostgreSQL, pgvector, and Google Gemini**.

Combines AI-powered learning tools with interactive educational games, helping students explore lesson content, test their knowledge, and engage with learning in a more interactive way.

---

## 🚀 Features

- 🤖 **AskAI** – Ask questions about lesson content and get AI-generated answers grounded in the learning material.
- 🧠 **Knowledge Check** – Answer AI-generated open-ended questions, receive scores, and get feedback to improve your understanding.
- 🏎️ **Road Race** – Complete randomly selected missions, collect correct items, avoid incorrect ones, and dodge rival cars.
- 🎮 **ParaWords** – *Upcoming* arcade-style activity featuring lesson-based missions and falling objects.
- 🏆 **Leaderboards** – Track overall performance, lesson scores, and game scores.

---

## 🧠 AI & RAG Highlights

- 📄 **Content Ingestion** – Process lesson content from Markdown files.
- ✂️ **Text Chunking** – Split lesson content into smaller chunks for retrieval.
- 🔢 **Embeddings** – Generate embeddings to represent lesson content.
- 🗄️ **Vector Storage** – Store lesson chunks and embeddings in PostgreSQL using pgvector.
- 🔍 **Retrieval-Augmented Generation (RAG)** – Retrieve relevant lesson content and use it as context for AI-generated responses.
- 🎯 **Grounded AI Responses** – Keep AI answers focused on the available learning material.

---

## 📦 Tech Stack

### Frontend

- React + Vite
- TypeScript
- Zustand (state management)
- TanStack Query (server state management)
- Tailwind CSS

### Backend

- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- pgvector

### AI

- Google Gemini API
- Embeddings
- Retrieval-Augmented Generation (RAG)

---

## 🏗️ Architecture Highlights

- Modular backend architecture with controllers, services, and repositories.
- Separation of frontend and backend responsibilities.
- AI-powered features integrated with lesson-based content retrieval.
- Content ingestion pipeline for processing and storing lesson material.
- Shared lesson content powering multiple AI learning activities.

---

## 🚧 Project Status

The project is under active development. Some activities and features are still being completed.

---

## 🌐 Live Demo

Coming soon.
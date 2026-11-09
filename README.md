# Smart Campus Assistant

An AI-powered campus management platform that simplifies student complaint handling and provides college-specific answers using Retrieval-Augmented Generation (RAG).
## 📸 Screenshots

<table>
  <tr>
    <td align="center">
      <strong>Homepage</strong><br/>
      <img src="https://github.com/user-attachments/assets/48031394-0802-4098-9a2c-74255e8b2126" width="400" />
    </td>
    <td align="center">
      <strong>Student Dashboard</strong><br/>
      <img src="https://github.com/user-attachments/assets/c4dc9f8b-80f0-42b0-a1f2-9595f93bb0fc" width="400" />
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Staff Dashboard</strong><br/>
      <img src="https://github.com/user-attachments/assets/72fb3544-41f8-4102-83b0-c2ea0bab9796" width="400" />
    </td>
    <td align="center">
      <strong>Admin Dashboard</strong><br/>
      <img src="https://github.com/user-attachments/assets/646cf529-0bff-4dd0-a00b-28bf9b720917" width="400" />
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <strong>AI Campus Assistant</strong><br/>
      <img src="https://github.com/user-attachments/assets/b4b2bcc1-996a-4cfd-969d-3d416c030b4b" width="400" />
    </td>
  </tr>
</table>


## 🚀 Features

- **User Authentication:** Separate access for Students, Staff, and Admins.
- **Complaint Management:** Students can submit complaints with descriptions, locations, and images.
- **AI Complaint Classification:** Automatically classifies complaints using a fine-tuned DistilBERT model and routes them to the appropriate department.
- **Complaint Tracking:** Students can track complaint status and view updates.
- **Staff Dashboard:** Staff can manage assigned complaints and update their status.
- **Admin Dashboard:** View complaint statistics and manage campus activities.
- **AI Campus Assistant:** Students can ask college-related questions and receive answers from uploaded college documents using RAG, along with source references.

## 🛠️ Tech Stack

| Component | Technologies |
|---|---|
| Frontend | React, Vite, TypeScript, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | MongoDB Atlas |
| Image Storage | Cloudinary |
| Authentication | JWT |
| AI Classification | DistilBERT, PyTorch, Hugging Face |
| RAG | Sentence Transformers, FAISS, Gemini |
| PDF Processing | PyMuPDF |

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

### 2. Backend Setup

```bash
python -m venv .venv
```

Activate the environment and install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn backend.main:app --reload
```

### 3. Frontend Setup

```bash
npm install
npm run dev
```

## 🔐 Environment Variables

Configure the required environment variables in your `.env` file, including:

- MongoDB connection string
- JWT secret key
- Cloudinary credentials
- Gemini API key

Do not commit your `.env` file or expose API keys.

## 🎯 Project Objective

To provide a centralized and intelligent campus platform that improves complaint resolution, streamlines communication between students and college departments, and makes college information easily accessible.

---

**Developed as a Final Year Project | B.Tech Computer Science and Engineering | 2023–2027**

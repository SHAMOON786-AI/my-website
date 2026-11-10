# Shamoon Ashraf - Developer Portfolio Website

A modern, high-performance developer portfolio built with **Python (Flask)**, **Tailwind CSS**, and modern **Neo-Glassmorphism** dark design.

---

## 🌟 Key Features

- **Modern Dark Neo-Glassmorphism**: Sleek dark slate canvas with animated ambient glowing orbs, frosted glass panels (`backdrop-blur`), and neon cyan/indigo accents.
- **Hero Section with Typing Effect**: Dynamic subtitle animation cycling through roles, availability badge, quick action buttons, and stat highlights.
- **Interactive Projects Showcase**:
  - Filterable by categories: `All`, `Full Stack`, `DevOps & Automation`, `Python & Flask`, `Simulations & Tools`.
  - Instant live keyword search bar across titles, tags, and descriptions.
  - Interactive Project Details Modal popup with extended descriptions and tech tags.
  - Links to GitHub source code and live demos.
- **Tech Stack & Skills Matrix**: Structured cards covering Languages, Frameworks & Backend, Databases & Tools with devicons and skill levels.
- **About & VIT Academic Background**: Showcase of your B.Tech Computer Science & Engineering journey at Vellore Institute of Technology (VIT).
- **Interactive AJAX Contact Pipeline**:
  - Direct email with one-click copy button.
  - Working `/api/contact` Flask backend route.
  - Real-time toast feedback for submission status.

---

## 🚀 Quick Start Guide

### 1. Launch with double-click
Simply double click `run.bat` in this folder.

### 2. Or run via Command Line
```powershell
# Using the project's virtual environment:
.\python-portfolio\venv\Scripts\python.exe app.py
```

### 3. Open in Browser
Visit [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

---

## 🛠 Project Structure

```
MY WEBSITE PORTTFOLIO/
├── app.py                     # Flask backend with routes and project/skills data
├── run.bat                    # One-click launcher script for Windows
├── templates/
│   └── index.html             # Neo-glassmorphic responsive HTML template
├── static/
│   ├── css/
│   │   └── style.css          # Glassmorphism, animations, and custom scrollbar
│   └── js/
│       └── main.js            # Typing effect, project filtering, modal, toast & AJAX contact
└── README.md                  # Documentation and customization guide
```

---

## ✏️ How to Customize

1. **Add or Edit Projects**: Open `app.py` and modify the `PROJECTS` list.
2. **Update Skills**: Open `app.py` and modify the `SKILLS` dictionary.
3. **Change Profile Info**: Update the `profile` dictionary inside the `home()` route in `app.py`.

import os
import time
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify, url_for

app = Flask(__name__)

# Base folder for uploads
UPLOAD_FOLDER = os.path.join(app.root_path, 'static', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 8 * 1024 * 1024  # Max 8MB
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_avatar_url():
    """Detect if an avatar exists in static/uploads and return its URL with cache buster."""
    if os.path.exists(UPLOAD_FOLDER):
        for f in os.listdir(UPLOAD_FOLDER):
            if f.startswith('avatar.'):
                mtime = int(os.path.getmtime(os.path.join(UPLOAD_FOLDER, f)))
                return f"/static/uploads/{f}?v={mtime}"
    return None

# Portfolio Project Showcases
PROJECTS = [
    {
        "id": "campus-portal",
        "title": "Campus Recruitment Portal",
        "category": "fullstack",
        "category_label": "Full Stack",
        "description": "Enterprise-ready placement and recruitment management portal featuring automated candidate onboarding sync, multi-stage application pipelines, and status safeguards.",
        "long_description": "Designed to streamline university placement drives. Integrates robust backend authentication, role-based dashboards for recruiters and students, real-time application status tracking, and database integrity checks.",
        "tags": ["Python", "Node.js", "Supabase", "PostgreSQL", "Tailwind CSS"],
        "github": "https://github.com/SHAMOON786-AI",
        "demo": "#",
        "featured": True,
        "badge": "Featured"
    },
    {
        "id": "website-change-detector",
        "title": "Real-Time Website Change Detector",
        "category": "devops",
        "category_label": "DevOps & Automation",
        "description": "Automated web monitoring engine that scans target URLs, tracks DOM mutations, detects real-time content changes, and triggers instant alerts.",
        "long_description": "A high-performance monitoring service containerized with Docker. Features scheduled site polling, DOM tree diffing, webhook alerts, and multi-cloud deployment configurations for Render and Vercel.",
        "tags": ["Node.js", "Docker", "Render", "Vercel", "Web Scraping", "REST APIs"],
        "github": "https://github.com/SHAMOON786-AI",
        "demo": "#",
        "featured": True,
        "badge": "Popular"
    },
    {
        "id": "study-streak-keeper",
        "title": "Study Streak Keeper",
        "category": "fullstack",
        "category_label": "Web Application",
        "description": "Gamified productivity and habit tracking web platform built to help students maintain daily study momentum and visualize learning consistency.",
        "long_description": "Encourages disciplined study routines through interactive streak heatmaps, daily goal logging, milestone badges, and persistent progress analytics.",
        "tags": ["Node.js", "Express", "Tailwind CSS", "JavaScript", "Analytics"],
        "github": "https://github.com/SHAMOON786-AI",
        "demo": "#",
        "featured": True,
        "badge": "Productivity"
    },
    {
        "id": "flood-barrier-sim",
        "title": "Flood Barrier 3D Simulation",
        "category": "graphics",
        "category_label": "Simulations & Tools",
        "description": "Interactive 3D simulation demonstrating adaptive flood barrier mechanics, hydrodynamics, and protective emergency response thresholds.",
        "long_description": "Built using JavaScript and modern 3D canvas rendering to visualize real-time water level shifts, mechanical barrier deployment, and stress simulations.",
        "tags": ["JavaScript", "3D Canvas", "Simulation", "Automation Scripts"],
        "github": "https://github.com/SHAMOON786-AI",
        "demo": "#",
        "featured": False,
        "badge": "Experimental"
    },
    {
        "id": "python-portfolio",
        "title": "Neo-Glassmorphism Developer Portfolio",
        "category": "python",
        "category_label": "Python & Flask",
        "description": "Lightweight, ultra-fast portfolio web application built with Flask and Tailwind CSS, featuring modern dark neo-glassmorphism and dynamic project filtering.",
        "long_description": "Crafted with micro-interactions, responsive frosted glass cards, dynamic category filtering, interactive modals, and asynchronous contact inquiry handling.",
        "tags": ["Python", "Flask", "Tailwind CSS", "Glassmorphism", "Responsive UI"],
        "github": "https://github.com/SHAMOON786-AI",
        "demo": "#",
        "featured": True,
        "badge": "Live"
    }
]

SKILLS = {
    "Languages": [
        {"name": "Python", "level": "Advanced", "icon": "devicon-python-plain text-yellow-400"},
        {"name": "C / C++", "level": "Proficient", "icon": "devicon-cplusplus-plain text-blue-400"},
        {"name": "Java", "level": "Intermediate", "icon": "devicon-java-plain text-red-400"},
        {"name": "JavaScript (ES6+)", "level": "Proficient", "icon": "devicon-javascript-plain text-yellow-300"},
        {"name": "HTML5 / CSS3", "level": "Expert", "icon": "devicon-html5-plain text-orange-400"}
    ],
    "Frameworks & Backend": [
        {"name": "Flask", "level": "Advanced", "icon": "devicon-flask-original text-white"},
        {"name": "Node.js / Express", "level": "Proficient", "icon": "devicon-nodejs-plain text-green-500"},
        {"name": "Tailwind CSS", "level": "Advanced", "icon": "devicon-tailwindcss-original text-cyan-400"},
        {"name": "RESTful APIs", "level": "Advanced", "icon": "fa-solid fa-network-wired text-indigo-400"}
    ],
    "Databases & Tools": [
        {"name": "Supabase / PostgreSQL", "level": "Proficient", "icon": "devicon-postgresql-plain text-blue-300"},
        {"name": "Docker", "level": "Intermediate", "icon": "devicon-docker-plain text-blue-500"},
        {"name": "Git & GitHub", "level": "Advanced", "icon": "devicon-git-plain text-red-500"},
        {"name": "Linux / Bash", "level": "Intermediate", "icon": "devicon-linux-plain text-gray-300"},
        {"name": "Render & Vercel", "level": "Proficient", "icon": "fa-solid fa-cloud text-purple-400"}
    ]
}

@app.route('/')
def home():
    profile = {
        "name": "MD SHAMOON ASHRAF",
        "tagline": "Computer Science Student & Full-Stack Python Developer",
        "institution": "Vellore Institute of Technology (VIT)",
        "email": "shamoonashraf.md2026@vitstudent.ac.in",
        "github": "https://github.com/SHAMOON786-AI",
        "linkedin": "https://linkedin.com",
        "location": "Vellore, Tamil Nadu, India",
        "avatar_url": get_avatar_url()
    }
    return render_template('index.html', profile=profile, projects=PROJECTS, skills=SKILLS)

@app.route('/api/upload-avatar', methods=['POST'])
def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({"success": False, "message": "No file uploaded."}), 400
    
    file = request.files['avatar']
    if file.filename == '':
        return jsonify({"success": False, "message": "No file selected."}), 400

    if not allowed_file(file.filename):
        return jsonify({
            "success": False, 
            "message": "Invalid file format. Please upload JPG, PNG, WEBP, or GIF."
        }), 400

    try:
        ext = file.filename.rsplit('.', 1)[1].lower()
        # Clean any old avatar files first
        for old_file in os.listdir(UPLOAD_FOLDER):
            if old_file.startswith('avatar.'):
                try:
                    os.remove(os.path.join(UPLOAD_FOLDER, old_file))
                except Exception:
                    pass

        new_filename = f"avatar.{ext}"
        destination = os.path.join(UPLOAD_FOLDER, new_filename)
        file.save(destination)

        cache_buster = int(time.time())
        avatar_url = f"/static/uploads/{new_filename}?v={cache_buster}"

        # If python-portfolio subdirectory exists, also sync there
        try:
            sub_folder = os.path.join(app.root_path, 'python-portfolio', 'static', 'uploads')
            if os.path.exists(sub_folder) and sub_folder != UPLOAD_FOLDER:
                import shutil
                shutil.copy2(destination, os.path.join(sub_folder, new_filename))
        except Exception:
            pass

        return jsonify({
            "success": True,
            "message": "Profile photo uploaded successfully!",
            "avatar_url": avatar_url
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": f"Upload failed: {str(e)}"}), 500

@app.route('/api/remove-avatar', methods=['POST'])
def remove_avatar():
    try:
        for old_file in os.listdir(UPLOAD_FOLDER):
            if old_file.startswith('avatar.'):
                try:
                    os.remove(os.path.join(UPLOAD_FOLDER, old_file))
                except Exception:
                    pass
        return jsonify({"success": True, "message": "Profile photo removed."}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Could not remove: {str(e)}"}), 500

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json(silent=True) or request.form
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    subject = data.get('subject', 'Portfolio Contact Inquiry').strip()
    message = data.get('message', '').strip()

    if not name or not email or not message:
        return jsonify({
            "success": False,
            "message": "Please fill in all required fields (Name, Email, and Message)."
        }), 400

    print(f"[CONTACT INQUIRY] From: {name} <{email}> | Subject: {subject}\nMessage: {message}\n")

    return jsonify({
        "success": True,
        "message": f"Thank you, {name}! Your message has been received. MD Shamoon Ashraf will get back to you shortly."
    }), 200

if __name__ == '__main__':
    # Listen on all interfaces (0.0.0.0) so it's accessible through network / tunnels
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

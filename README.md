# Group 12 Lab 3 - Black & Gold Circuit Website

A dynamic team portfolio website featuring a black and gold theme, interactive circuit animation, team member profiles with full content management, and a secure admin dashboard.

##  Team Members
- **Chris Keller**
- **TJ Meltesen**
- **Mazin Ali**
- **Jake Bleeden**

---

##  Project Structure

```
Lab3/
├── index.html              # Landing page with animated circuit
├── README.md               # Project documentation
│
├── html/                   # Team member pages
│   ├── teammates.html      # Team grid/selection page
│   ├── chris.html          # Chris's profile page
│   ├── tj.html             # TJ's profile page
│   ├── mazin.html          # Mazin's profile page
│   ├── jake.html           # Jake's profile page
│   └── protected.html      # Admin dashboard (password protected)
│
├── js/                     # JavaScript files
│   ├── circuit.js          # Circuit animation logic
│   ├── script.js           # Core site functionality & auth
│   ├── profile.js          # Profile page data loading
│   ├── protected.js        # Admin dashboard functionality
│   ├── teammates_profile_images.js  # Team grid image/major loader
│   └── auth_config.js      # Password hash configuration
│
├── assets/                 # Backend & uploads
│   ├── upload_image.php    # Profile image upload handler
│   ├── save_bio.php        # Biography save/load API
│   ├── save_major.php      # Major/info save/load API
│   ├── resume.php          # Resume upload/download API
│   ├── save_message.php    # Contact form message handler
│   ├── get_messages.php    # Retrieve all visitor messages
│   ├── delete_message.php  # Delete visitor messages
│   ├── phpinfo.php         # PHP environment info
│   ├── images/             # Uploaded profile images
│   ├── resumes/            # Uploaded PDF resumes
│   └── text/               # Bio and major text files
│
└── tools/                  # Offline admin utilities
    ├── change_password.py  # Python password change script
    ├── change_password.ps1 # PowerShell password change script
    ├── change_password.bat # Windows batch launcher
    └── README.md           # Tools documentation
```

---

##  Features

###  Landing Page (`index.html`)
- Interactive SVG circuit diagram with battery, switch, resistor, and LED components
- Animated battery charge meter (drains from gold to indicate progress)
- Click the circuit switch to trigger battery drain animation
- Auto-navigates to team page after animation completes
- Modern black and gold color scheme with Montserrat/Open Sans fonts

###  Team Selection Page (`teammates.html`)
- Responsive grid layout of team member profile cards
- Dynamic profile image loading from server
- Displays each member's major/field of study
- Hover animations with gold accent highlighting
- Link to password-protected admin area

###  Individual Profile Pages (`chris.html`, `tj.html`, `mazin.html`, `jake.html`)
- **Three-tab interface:**
  - **Biography** - Personal bio loaded from server
  - **Resume** - PDF viewer with download option
  - **Contact** - Message form to reach team member
- Profile image display with hover effects
- Responsive layout for mobile and desktop
- Back navigation to team page

###  Admin Dashboard (`protected.html`)
- **SHA-256 password protection** (client-side authentication)
- Edit capabilities for all team members:
  - Upload/change profile images (JPG, PNG, GIF)
  - Edit major/field of study
  - Edit biography text
  - Upload PDF resumes
- **Visitor Messages Section:**
  - View all contact form submissions
  - See sender name, email, phone, and message
  - Delete messages
  - Sorted by newest first

###  Contact/Messaging System
- Visitors can send messages to any team member via profile pages
- Messages stored server-side with timestamps
- Admin can view and manage all messages
- Form validation for required fields

###  Offline Admin Tools (`tools/`)
- Cross-platform password change utilities
- Python, PowerShell, and Batch scripts available
- SHA-256 password hashing
- No web-based password change (security by design)

---

##  Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Backend** | PHP 7+ |
| **Fonts** | Google Fonts (Montserrat, Open Sans) |
| **Libraries** | JSZip (for resume handling) |
| **Authentication** | SHA-256 client-side hash verification |

---

##  Setup & Deployment

### Requirements
- Web server with PHP 7+ support (Apache, Nginx, XAMPP, etc.)
- Writable directories for `assets/images/`, `assets/resumes/`, `assets/text/`, and `assets/logs/`

### Local Development
1. Clone/download the repository
2. Start a local PHP server:
   ```bash
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### Changing the Admin Password
1. Navigate to the `tools/` directory
2. Run the password change script:
   ```powershell
   # Windows PowerShell
   .\change_password.ps1
   
   # Python (cross-platform)
   python change_password.py
   ```
3. Follow the prompts to set a new password
4. Deploy the updated `js/auth_config.js` file

---

##  API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/assets/upload_image.php` | POST | Upload profile image |
| `/assets/save_bio.php` | GET/POST | Load or save biography |
| `/assets/save_major.php` | GET/POST | Load or save major |
| `/assets/resume.php` | GET/POST | Load or upload resume |
| `/assets/save_message.php` | POST | Submit contact message |
| `/assets/get_messages.php` | GET | Retrieve all messages |
| `/assets/delete_message.php` | POST | Delete a message |

---

##  License

Group 12 Lab 3 © 2025

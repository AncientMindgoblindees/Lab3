# Lab3 Admin Tools

This directory contains offline tools for managing the Lab3 website.

## Password Change Tool

The website password can only be changed offline using these tools. There is intentionally **no mechanism** to change the password from the website itself for security reasons.

### Available Scripts

| Script | Platform | Requirements |
|--------|----------|--------------|
| `change_password.py` | Cross-platform | Python 3.6+ |
| `change_password.ps1` | Windows | PowerShell 5.1+ |
| `change_password.bat` | Windows | Python 3.6+ (launches .py) |

### Usage

#### Windows (PowerShell)
```powershell
cd tools
.\change_password.ps1
```

#### Windows (Python)
```cmd
cd tools
python change_password.py
```
Or double-click `change_password.bat`

#### Mac/Linux
```bash
cd tools
python3 change_password.py
```

### What the Script Does

1. Prompts you for a new password (hidden input)
2. Validates password strength (optional warnings)
3. Asks for password confirmation
4. Generates a SHA-256 hash of the password
5. Creates a new `auth_config.js` file
6. Optionally updates the actual config file directly

### Deployment

After generating a new password:

1. **If you chose to update directly:**
   - Test the new password locally
   - Commit the changes: `git add js/auth_config.js && git commit -m "Update admin password"`
   - Push to your repository
   - Deploy to your web server

2. **If you saved to the output directory:**
   - Copy `tools/output/auth_config.js` to `js/auth_config.js`
   - Upload to your web server
   - Clear browser cache and test

### Security Notes

- ⚠️ Passwords are **never** stored in plain text
- ⚠️ Only the SHA-256 hash is saved
- ⚠️ Run these scripts **offline/locally**, not on the web server
- ⚠️ Do not commit the output directory to public repositories
- ⚠️ Delete any temporary files after use

### Output Directory

Generated files are saved to `tools/output/`. This directory is created automatically and should be added to `.gitignore` if not already.

### Troubleshooting

**"Python is not installed"**
- Install Python from https://python.org
- Or use the PowerShell version instead

**"Script execution is disabled" (PowerShell)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**Password not working after deployment**
- Clear your browser cache and cookies
- Try incognito/private browsing mode
- Verify the auth_config.js file was uploaded correctly

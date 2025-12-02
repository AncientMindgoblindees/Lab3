#!/usr/bin/env python3
"""
Password Change Tool for Lab3 Website
======================================

This script generates a new auth_config.js file with a hashed password.
The generated file can then be uploaded to the web server to change the
admin password.

Usage:
    python change_password.py

The script will:
1. Prompt for a new password (with confirmation)
2. Generate a SHA-256 hash of the password
3. Create a new auth_config.js file in the output directory
4. Display instructions for deploying the new configuration

Security Notes:
- Passwords are never stored in plain text
- Only the SHA-256 hash is saved to the configuration file
- The password is not logged or saved anywhere
- Run this script offline/locally, not on the web server
"""

import hashlib
import os
import getpass
import sys
from datetime import datetime


def sha256_hash(password: str) -> str:
    """Generate SHA-256 hash of a password."""
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def validate_password(password: str) -> tuple[bool, str]:
    """
    Validate password strength.
    Returns (is_valid, message).
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long."
    
    has_upper = any(c.isupper() for c in password)
    has_lower = any(c.islower() for c in password)
    has_digit = any(c.isdigit() for c in password)
    
    if not (has_upper and has_lower and has_digit):
        return False, "Password should contain uppercase, lowercase, and numeric characters."
    
    return True, "Password meets requirements."


def generate_auth_config(password_hash: str) -> str:
    """Generate the contents of auth_config.js."""
    return f'''// SHA256 hash of the secure password
// Generated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")}
// DO NOT share this file publicly or commit to public repositories
const PASSWORD_HASH = "{password_hash}";
'''


def main():
    print("=" * 60)
    print("  Lab3 Website Password Change Tool")
    print("=" * 60)
    print()
    print("This tool will generate a new auth_config.js file with your")
    print("new password. Upload the generated file to your web server")
    print("to change the admin password.")
    print()
    print("-" * 60)
    
    # Get new password
    while True:
        print()
        password = getpass.getpass("Enter new password: ")
        
        if not password:
            print("Error: Password cannot be empty.")
            continue
        
        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            print(f"Warning: {message}")
            proceed = input("Continue anyway? (y/n): ").strip().lower()
            if proceed != 'y':
                continue
        
        # Confirm password
        password_confirm = getpass.getpass("Confirm new password: ")
        
        if password != password_confirm:
            print("Error: Passwords do not match. Please try again.")
            continue
        
        break
    
    # Generate hash
    password_hash = sha256_hash(password)
    
    print()
    print("-" * 60)
    print("Password hash generated successfully!")
    print(f"Hash: {password_hash}")
    print()
    
    # Determine output paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    
    # Output directory for generated files
    output_dir = os.path.join(script_dir, "output")
    os.makedirs(output_dir, exist_ok=True)
    
    # Also offer to update the actual config file
    actual_config_path = os.path.join(project_root, "js", "auth_config.js")
    output_config_path = os.path.join(output_dir, "auth_config.js")
    
    # Generate config content
    config_content = generate_auth_config(password_hash)
    
    # Save to output directory
    with open(output_config_path, 'w', encoding='utf-8') as f:
        f.write(config_content)
    
    print(f"New auth_config.js saved to:")
    print(f"  {output_config_path}")
    print()
    
    # Ask if user wants to update the actual file
    print("Would you like to also update the actual auth_config.js file?")
    print(f"  Location: {actual_config_path}")
    update_actual = input("Update now? (y/n): ").strip().lower()
    
    if update_actual == 'y':
        try:
            with open(actual_config_path, 'w', encoding='utf-8') as f:
                f.write(config_content)
            print()
            print("✓ auth_config.js has been updated!")
            print()
            print("Next steps:")
            print("  1. Test the new password locally")
            print("  2. Commit and push the changes to your repository")
            print("  3. Deploy to your web server")
        except Exception as e:
            print(f"Error updating file: {e}")
            print("You can manually copy the file from the output directory.")
    else:
        print()
        print("To deploy the new password:")
        print("  1. Copy the generated auth_config.js to your js/ directory")
        print("  2. Upload to your web server")
        print("  3. Clear your browser cache and test the new password")
    
    print()
    print("=" * 60)
    print("  Password change complete!")
    print("=" * 60)
    
    # Security reminder
    print()
    print("SECURITY REMINDER:")
    print("- Never share your password or this hash publicly")
    print("- Delete any temporary files containing password information")
    print("- Consider using a password manager")
    print()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nOperation cancelled by user.")
        sys.exit(1)

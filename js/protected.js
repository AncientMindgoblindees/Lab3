// protected.js
// Centralized script for protected.html profile editing

document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (typeof checkProtectedAuth === 'function') {
        checkProtectedAuth();
    }
    // Setup profile editing for all users
    const profiles = [
        {name: 'chris'},
        {name: 'tj'},
        {name: 'mazin'},
        {name: 'jake'}
    ];
    profiles.forEach(profile => {
        if (typeof setupProfileImageInput === 'function') {
            setupProfileImageInput(`${profile.name}-img`, `${profile.name}-img-preview`, profile.name);
        }
        if (typeof setupBioInput === 'function') {
            setupBioInput(`${profile.name}-bio`, `save-${profile.name}`, profile.name);
        }
        // Setup resume upload
        setupResumeInput(`${profile.name}-resume`, `${profile.name}-resume-status`, profile.name);
        // Setup major input
        setupMajorInput(`${profile.name}-major`, `save-${profile.name}`, profile.name);
    });
});



// Utility to handle image preview and saving for all profiles
function setupProfileImageInput(imgInputId, imgPreviewId, profileName) {
    const input = document.getElementById(imgInputId);
    const preview = document.getElementById(imgPreviewId);
    const exts = ['jpg', 'png', 'gif'];
    function tryLoad(extIdx) {
        if (extIdx >= exts.length) {
            preview.style.display = 'none';
            return;
        }
        var url = `/assets/images/${profileName}.${exts[extIdx]}`;
        fetch(url, {method: 'HEAD'}).then(function(res) {
            if (res.ok) {
                preview.src = url + '?t=' + Date.now();
                preview.style.display = 'block';
            } else {
                tryLoad(extIdx + 1);
            }
        });
    }
    tryLoad(0);
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profileImg', file);
            formData.append('profile', profileName);
            fetch('/assets/upload_image.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    tryLoad(0);
                    alert('Image uploaded successfully!');
                } else {
                    alert('Upload failed: ' + data.message);
                }
            })
            .catch(err => {
                alert('Error uploading image: ' + err);
            });
        }
    });
}

// Utility to handle biography saving/loading
function setupBioInput(bioInputId, saveBtnId, profileName) {
    const textarea = document.getElementById(bioInputId);
    const saveBtn = document.getElementById(saveBtnId);
    // Load bio from server
    fetch(`/assets/save_bio.php?profile=${encodeURIComponent(profileName)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.bio !== undefined) {
                textarea.value = data.bio;
            } else {
                textarea.value = '';
            }
        });
    saveBtn.onclick = function() {
        fetch('/assets/save_bio.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `profile=${encodeURIComponent(profileName)}&bio=${encodeURIComponent(textarea.value)}`
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert('Biography saved!');
            } else {
                alert('Failed to save bio: ' + data.message);
            }
        });
    };
}

// Utility to handle resume upload
function setupResumeInput(resumeInputId, statusId, profileName) {
    const input = document.getElementById(resumeInputId);
    const status = document.getElementById(statusId);
    
    if (!input || !status) return;
    
    // Check if resume exists
    fetch(`/assets/resume.php?profile=${encodeURIComponent(profileName)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.exists) {
                status.innerHTML = `<a href="${data.url}" target="_blank" style="color:#ffd700;">View current resume</a>`;
            } else {
                status.textContent = 'No resume uploaded yet.';
            }
        });
    
    // Handle resume upload
    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file.');
                return;
            }
            
            const formData = new FormData();
            formData.append('resume', file);
            formData.append('profile', profileName);
            
            status.textContent = 'Uploading...';
            
            fetch('/assets/resume.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    status.innerHTML = `<span style="color:#4caf50;">Resume uploaded!</span> <a href="/assets/resumes/${profileName}.pdf" target="_blank" style="color:#ffd700;">View</a>`;
                    alert('Resume uploaded successfully!');
                } else {
                    status.textContent = 'Upload failed: ' + data.message;
                    alert('Upload failed: ' + data.message);
                }
            })
            .catch(err => {
                status.textContent = 'Error uploading resume.';
                alert('Error uploading resume: ' + err);
            });
        }
    });
}

// Utility to handle major/info saving/loading
function setupMajorInput(majorInputId, saveBtnId, profileName) {
    const input = document.getElementById(majorInputId);
    const saveBtn = document.getElementById(saveBtnId);
    
    if (!input) return;
    
    // Load major from server
    fetch(`/assets/save_major.php?profile=${encodeURIComponent(profileName)}`)
        .then(res => res.json())
        .then(data => {
            if (data.success && data.major !== undefined) {
                input.value = data.major;
            } else {
                input.value = '';
            }
        });
    
    // Save major when save button is clicked (alongside bio)
    const originalOnClick = saveBtn.onclick;
    saveBtn.onclick = function() {
        // Save major
        fetch('/assets/save_major.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `profile=${encodeURIComponent(profileName)}&major=${encodeURIComponent(input.value)}`
        })
        .then(res => res.json())
        .then(data => {
            if (!data.success) {
                alert('Failed to save major: ' + data.message);
            }
        });
        
        // Call original onClick (for bio save)
        if (originalOnClick) {
            originalOnClick.call(this);
        }
    };
}
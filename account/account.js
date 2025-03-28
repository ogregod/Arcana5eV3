// account/account.js
import { auth, db, doc, getDoc, updateDoc, storage, storageRef, uploadBytes, getDownloadURL } from '/assets/js/firebase.js';
import { getUserProfile } from '/assets/js/auth.js';

// account/account.js
import { auth, db, doc, getDoc, updateDoc, storage, storageRef, uploadBytes, getDownloadURL } from '/assets/js/firebase.js';
import { getUserProfile } from '/assets/js/auth.js';
import { loadBanner } from '/assets/js/components.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // First, load the banner component
    await loadBanner();
    
    // Now initialize page-specific functionality
    initAccountPage();
  } catch (error) {
    console.error('Error initializing account page:', error);
  }
});

async function initAccountPage() {
  // Check if user is authenticated
  const user = auth.currentUser;
  if (!user) {
    // User not logged in - no need to initialize further
    return;
  }
  
  // Load user profile data
  const profile = await getUserProfile();
  // Rest of your existing account page initialization code...
}

async function initAccountPage() {
  // Check if user is authenticated
  const user = auth.currentUser;
  if (!user) {
    // User not logged in - no need to initialize further
    return;
  }
  
  // Load user profile data
  const profile = await getUserProfile();
  if (!profile) {
    console.error('Failed to load user profile');
    return;
  }
  
  // Populate user information
  document.getElementById('user-email').textContent = user.email;
  
  const displayNameInput = document.getElementById('display-name');
  displayNameInput.value = profile.displayName || '';
  
  document.querySelectorAll('.user-display-name').forEach(el => {
    el.textContent = profile.displayName || 'User';
  });
  
  // Set theme preference
  const themeSelect = document.getElementById('theme');
  themeSelect.value = profile.preferences?.theme || 'light';
  
  // Check Patreon status
  if (profile.patreonLinked) {
    document.getElementById('patreon-status').style.display = 'none';
    document.getElementById('patreon-connected').style.display = 'block';
    document.getElementById('patreon-tier-name').textContent = profile.patreonTier || 'Supporter';
    
    // Update subscription badge
    document.getElementById('free-tier').style.display = 'none';
    document.getElementById('patron-tier').style.display = 'inline-block';
    
    // Update benefit icons
    document.getElementById('custom-items-icon').classList.replace('locked', 'available');
    document.getElementById('custom-items-icon').textContent = '✓';
    
    document.getElementById('custom-locations-icon').classList.replace('locked', 'available');
    document.getElementById('custom-locations-icon').textContent = '✓';
    
    document.getElementById('price-adjustment-icon').classList.replace('locked', 'available');
    document.getElementById('price-adjustment-icon').textContent = '✓';
    
    document.getElementById('bulk-export-icon').classList.replace('locked', 'available');
    document.getElementById('bulk-export-icon').textContent = '✓';
  }
  
  // Load profile picture if exists
  if (user.photoURL) {
    document.getElementById('profile-image').src = user.photoURL;
  }
  
  // Setup event listeners
  setupFormHandlers();
  setupProfilePictureUpload();
  setupPasswordChangeHandlers();
  setupPatreonHandlers();
}

function setupFormHandlers() {
  const accountForm = document.getElementById('account-form');
  
  accountForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;
    
    const displayName = document.getElementById('display-name').value.trim();
    const theme = document.getElementById('theme').value;
    
    try {
      // Update user profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        displayName: displayName,
        "preferences.theme": theme,
        updatedAt: new Date().toISOString()
      });
      
      // Update display name elements
      document.querySelectorAll('.user-display-name').forEach(el => {
        el.textContent = displayName || 'User';
      });
      
      alert('Account settings updated successfully!');
    } catch (error) {
      console.error('Error updating account:', error);
      alert('Error updating account: ' + error.message);
    }
  });
}

function setupProfilePictureUpload() {
  const changePictureBtn = document.getElementById('change-picture-btn');
  const fileInput = document.getElementById('profile-picture-upload');
  
  changePictureBtn.addEventListener('click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      // Upload image to Firebase Storage
      const storageReference = storageRef(storage, `profile-pictures/${user.uid}`);
      await uploadBytes(storageReference, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageReference);
      
      // Update user profile
      await updateDoc(doc(db, "users", user.uid), {
        photoURL: downloadURL,
        updatedAt: new Date().toISOString()
      });
      
      // Update profile image in UI
      document.getElementById('profile-image').src = downloadURL;
      
      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Error uploading profile picture: ' + error.message);
    }
  });
}

function setupPasswordChangeHandlers() {
  const changePasswordBtn = document.getElementById('change-password-btn');
  const passwordChangeForm = document.getElementById('password-change-form');
  const savePasswordBtn = document.getElementById('save-password-btn');
  const cancelPasswordBtn = document.getElementById('cancel-password-btn');
  
  changePasswordBtn.addEventListener('click', () => {
    passwordChangeForm.style.display = 'block';
    changePasswordBtn.style.display = 'none';
  });
  
  cancelPasswordBtn.addEventListener('click', () => {
    passwordChangeForm.style.display = 'none';
    changePasswordBtn.style.display = 'block';
    
    // Clear password fields
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });
  
  savePasswordBtn.addEventListener('click', async () => {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    // Here you would implement the password change functionality
    // using Firebase Authentication
    alert('Password change functionality will be implemented here');
    
    // Reset form
    passwordChangeForm.style.display = 'none';
    changePasswordBtn.style.display = 'block';
    
    // Clear password fields
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });
}

function setupPatreonHandlers() {
  const connectPatreonBtn = document.getElementById('connect-patreon-btn');
  const disconnectPatreonBtn = document.getElementById('disconnect-patreon-btn');
  
  connectPatreonBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Here you would implement Patreon OAuth flow
    alert('Patreon connection functionality will be implemented here');
  });
  
  disconnectPatreonBtn?.addEventListener('click', async () => {
    const user = auth.currentUser;
    if (!user) return;
    
    try {
      // Update user profile in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        patreonLinked: false,
        patreonTier: null,
        updatedAt: new Date().toISOString()
      });
      
      // Update UI
      document.getElementById('patreon-status').style.display = 'block';
      document.getElementById('patreon-connected').style.display = 'none';
      
      // Update subscription badge
      document.getElementById('free-tier').style.display = 'inline-block';
      document.getElementById('patron-tier').style.display = 'none';
      
      // Update benefit icons
      document.getElementById('custom-items-icon').classList.replace('available', 'locked');
      document.getElementById('custom-items-icon').textContent = '🔒';
      
      document.getElementById('custom-locations-icon').classList.replace('available', 'locked');
      document.getElementById('custom-locations-icon').textContent = '🔒';
      
      document.getElementById('price-adjustment-icon').classList.replace('available', 'locked');
      document.getElementById('price-adjustment-icon').textContent = '🔒';
      
      document.getElementById('bulk-export-icon').classList.replace('available', 'locked');
      document.getElementById('bulk-export-icon').textContent = '🔒';
      
      alert('Patreon account disconnected successfully!');
    } catch (error) {
      console.error('Error disconnecting Patreon:', error);
      alert('Error disconnecting Patreon: ' + error.message);
    }
  });
}
# Complete Firebase Setup Guide for Invoice Generator

## Overview
This guide will help you set up Firebase Firestore database to store all your invoice generator data permanently (clients, doctors, medicines, manufacturers, and invoices).

---

## STEP 1: Create Firebase Project

1. Go to **https://console.firebase.google.com/**
2. Click **"Create a new project"** or use an existing project
3. Enter project name (e.g., "Invoice Generator")
4. Continue with default settings
5. Click **"Create project"**
6. Wait for the project to be created

---

## STEP 2: Enable Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Click on **Email/Password** provider
4. Toggle **"Enable"** to ON
5. Click **"Save"**

✅ Email/Password authentication is now enabled for login/signup

---

## STEP 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar under "Build")
2. Click **"Create Database"**
3. Choose your region (recommended: closest to your location)
4. Click **"Next"**
5. For Security Rules, select **"Start in test mode"** (we'll secure it next)
6. Click **"Enable"**
7. Wait for Firestore to initialize (1-2 minutes)

✅ Your Firestore database is now created

---

## STEP 4: Configure Security Rules (CRITICAL FOR DATA PERSISTENCE)

1. In Firestore Database, click on the **"Rules"** tab at the top
2. You'll see existing rules - **SELECT ALL AND DELETE** them
3. Copy and paste this exact code:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write all collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"** button
5. Confirm by clicking **"Publish"** in the dialog

✅ Security rules are now set to allow authenticated users to save data

---

## STEP 5: Get Your Firebase Configuration

1. In Firebase Console, click on **"Project Settings"** (gear icon, top right)
2. Scroll down to **"Your apps"** section
3. Under **"Web"** section, click the **"</>""** icon if you don't see your app
4. Register app with name "invoice-generator"
5. You'll see a code snippet with your Firebase config
6. Copy these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

Example of what you're looking for:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef1234567890"
};
```

---

## STEP 6: Add Firebase Config to Your Replit Project

Your app is already configured to use these environment variables. Make sure you have set:

1. Go to your Replit project
2. Click the **"Secrets"** button (lock icon, left sidebar)
3. Add each variable:

```
VITE_FIREBASE_API_KEY = your_api_key
VITE_FIREBASE_PROJECT_ID = your_project_id
VITE_FIREBASE_AUTH_DOMAIN = your_auth_domain
VITE_FIREBASE_STORAGE_BUCKET = your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID = your_messaging_sender_id
VITE_FIREBASE_APP_ID = your_app_id
```

If these are already set, verify they match your Firebase project settings exactly.

---

## STEP 7: Understanding Your Database Structure

Your Firestore database will automatically create these collections when you start using the app:

### Collection: `clients`
Stores patient/client information
```
{
  id: "auto-generated",
  patientName: "John Doe",
  address: "123 Main St",
  mobileNo: "+1234567890",
  contact: "john@example.com",
  createdAt: 1700000000000
}
```

### Collection: `doctors`
Stores doctor information
```
{
  id: "auto-generated",
  name: "Dr. Smith",
  specialization: "Cardiologist",
  licenseNo: "LIC123",
  createdAt: 1700000000000
}
```

### Collection: `medicines`
Stores medicine details
```
{
  id: "auto-generated",
  name: "Aspirin",
  category: "Pain Relief",
  price: 5.99,
  stock: 100,
  manufacturerName: "ABC Pharma",
  createdAt: 1700000000000
}
```

### Collection: `manufacturers`
Stores manufacturer information
```
{
  id: "auto-generated",
  name: "ABC Pharma",
  location: "New York",
  contact: "contact@abcpharma.com",
  createdAt: 1700000000000
}
```

### Collection: `invoices`
Stores invoice records (auto-calculated)
```
{
  id: "auto-generated",
  invoiceNumber: "INV-12345678",
  date: 1700000000000,
  clientId: "client_id_reference",
  clientName: "John Doe",
  clientAddress: "123 Main St",
  clientMobile: "+1234567890",
  clientContact: "john@example.com",
  doctorId: "doctor_id_reference",
  doctorName: "Dr. Smith",
  doctorSpecialization: "Cardiologist",
  items: [
    {
      medicineId: "medicine_id",
      medicineName: "Aspirin",
      category: "Pain Relief",
      quantity: 2,
      price: 5.99,
      total: 11.98
    }
  ],
  subtotal: 11.98,
  total: 11.98,
  createdAt: 1700000000000
}
```

---

## STEP 8: Verify Your Setup is Working

1. Reload your Replit app
2. **Sign up** with a new email and password
3. Create a **client** (e.g., "John Doe")
4. Create a **doctor** (e.g., "Dr. Smith")
5. Create a **medicine** (e.g., "Aspirin")
6. Create an **invoice** with these items
7. Check your browser console (F12 → Console tab) - you should see:
   ```
   Creating invoice with data: {...}
   Attempting to save invoice to Firestore: {...}
   Invoice saved successfully with ID: abc123def456
   ```

✅ If you see these logs, data is being saved to Firebase!

### To verify data in Firebase Console:
1. Go to **Firestore Database** in Firebase Console
2. Click on collections (e.g., "clients", "invoices")
3. You should see your records listed

---

## STEP 9: Understanding Real-Time Sync

Your app uses **real-time subscriptions** - this means:
- When you add a client, it appears instantly
- When you create an invoice, it saves immediately
- Data syncs across browser tabs automatically
- If you close and reopen the app, all data is still there

---

## STEP 10: Backup Your Data

Your data is automatically backed up by Firebase. To view/export your data:

1. Go to **Firestore Database** in Firebase Console
2. Right-click on any collection
3. Click **Export subcollection** to download your data

---

## Troubleshooting

### Issue: "Permission denied" error when creating data
**Solution:** Your Firestore Security Rules are not set correctly. Go back to STEP 4 and ensure you've published the correct rules.

### Issue: "Firebase not initialized" error
**Solution:** Your environment variables are incorrect. Go to STEP 6 and verify all values match your Firebase project exactly.

### Issue: Data not appearing after creation
**Solution:** 
1. Check browser console (F12) for errors
2. Go to Firestore Console → Collections
3. Verify collections exist and have documents
4. If not, check that you're logged in (click your profile icon in the app)

### Issue: "Auth domain mismatch" error
**Solution:** Your `authDomain` in environment variables is incorrect. It should be in format: `your-project.firebaseapp.com`

---

## Security Checklist

✅ Do:
- Use the security rules provided above
- Only share project ID (not API key) publicly
- Keep your API keys in Replit secrets
- Test authentication works before deploying

❌ Don't:
- Publish your app with security rules in "test mode"
- Share your Firebase API keys publicly
- Store sensitive data without encryption
- Use weak passwords for admin accounts

---

## Next Steps

1. Follow Steps 1-6 above
2. Reload your app
3. Test by creating clients, doctors, medicines, and invoices
4. Check Firestore Console to see your data being stored
5. Once working, your data will persist permanently!

---

## Additional Resources

- **Firebase Console:** https://console.firebase.google.com/
- **Firestore Documentation:** https://firebase.google.com/docs/firestore
- **Firebase Authentication:** https://firebase.google.com/docs/auth

---

**Your app is already configured to use Firebase. Follow this guide to set up the database, and all your data will persist permanently!**

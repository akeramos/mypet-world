// auth-header.js - Modular Header Authentication Render Engine
function initHeaderAuth() {
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.firestore) {
        
        firebase.auth().onAuthStateChanged(async (user) => {
            const navContainer = document.getElementById('header-nav-container');
            
            // Safety Guard: If the script fires before the placeholder finishes rendering, exit gracefully
            if (!navContainer) return;

            if (user && user.emailVerified) {
                try {
                    const db = firebase.firestore();
                    const userDoc = await db.collection("users").doc(user.uid).get();
                    
                    // Default fallback string parameter matching email prefix
                    let displayName = user.email.split('@')[0]; 
                    
                    // Pull real custom username entry from your Firestore database collection row
                    if (userDoc.exists && userDoc.data().username) {
                        displayName = userDoc.data().username;
                    }

                    navContainer.innerHTML = `
                        <span class="nav-user-greeting">👋 Hi, ${displayName}</span>
                        <a href="account.html" class="nav-link account-btn">🎛️ Portal</a>
                    `;
                } catch (error) {
                    console.error("Firestore user read failed inside script asset module:", error);
                    const backupName = user.email.split('@')[0];
                    navContainer.innerHTML = `
                        <span class="nav-user-greeting">👋 Hi, ${backupName}</span>
                        <a href="account.html" class="nav-link account-btn">🎛️ Portal</a>
                    `;
                }
            } else {
                // Unauthenticated Guest State Fallback Link Option
                navContainer.innerHTML = `
                    <a href="account.html" class="nav-link account-btn">👤 Account</a>
                `;
            }
        });
    } else {
        console.warn("Firebase scripts not fully registered yet.");
    }
}

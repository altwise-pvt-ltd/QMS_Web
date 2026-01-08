    # Walkthrough: Session Maintenance & Route Protection Complete!

    I have successfully implemented a robust, secure, and persistent authentication system for your QMS application.

    ## Key Accomplishments

    ### 1. Global Session Management (`AuthContext.jsx`)

    - Created a central "source of truth" for authentication state.
    - **Persistence:** On page refresh, the app automatically checks `localStorage`, validates the token, and restores the user's session.
    - **Loading State:** Prevents "flickering" or accidental redirects while the session is being verified.

    ### 2. Intelligent Route Guarding (`ProtectedRoute.jsx` & `App.jsx`)

    - **Locked Routes:** All features (Dashboard, Documents, Training, etc.) are now wrapped in a `ProtectedRoute`.
    - **Auto-Redirect:** If an unauthenticated user tries to access a protected URL, they are automatically sent to `/login`.
    - **Deep Linking:** The guard remembers where the user was trying to go and can redirect them back after they log in.

    ### 3. Enhanced User Experience

    - **Login:** The `Login` component now fetches the actual user profile (Name, Avatar, Role) immediately after getting tokens.
    - **Sidebar Integration:**
    - Displays the user's **Name**, **Avatar**, and **Role** at the bottom.
    - Functional **Sign Out** button that properly clears the session and state.

    ### 4. Automatic Token Maintenance (`api.js`)

    - Your existing interceptor logic is now fully integrated.
    - It automatically attaches the `accessToken` to all requests.
    - If the token expires, it attempts a refresh in the background. If the refresh fails, it forces a logout to keep the app secure.

    ## Data Flow Summary

    ```mermaid
    graph TD
        User([User]) --> Login[login.jsx]
        Login -- "1. Credentials" --> AuthService[authService.js]
        AuthService -- "2. POST Request" --> api.js
        api.js -- "3. Tokens" --> AuthService
        AuthService -- "4. Save" --> LS[(LocalStorage)]
        Login -- "5. Set User Profile" --> AuthContext[AuthContext.jsx]

        subgraph "Navigation Guard"
        AuthContext -- "6. isAuthenticated?" --> ProtectedRoute[ProtectedRoute.jsx]
        ProtectedRoute -- "Allow" --> Dashboard[Dashboard / Documents / etc.]
        end

        subgraph "Persistence on Refresh"
        Refresh(Page Refresh) --> AuthContext
        AuthContext -- "7. Read Token" --> LS
        AuthContext -- "8. Validate Profile" --> api.js
        api.js -- "9. Restore Session" --> AuthContext
        end
    ```

    ## How to Test

    1. **Login:** Use a valid email/password (e.g., from Platzi's fake API). You should see your profile in the Sidebar.
    2. **Persistence:** Refresh the browser. You should stay on your current page without having to log in again.
    3. **Logout:** Click "Sign Out". You should be taken back to `/login` and unable to access `/dashboard` until you log in again.
    4. **Direct Access:** Try typing `your-url/dashboard` in a new private window. It should redirect you to `/login`.

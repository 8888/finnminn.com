# Class Structure

## DOM Elements (IDs)

The following IDs will be used to manipulate the DOM via `src/public/auth.js` and inline scripts.

| ID | Description |
| :--- | :--- |
| `loading` | Container for the authentication loading state. |
| `content` | Container for the protected dashboard content. |
| `username` | Span element to display the authenticated user's name. |

## Script Functions

Existing functions from `auth.js` will be utilized.
-   `signIn()`
-   `signOut()`
-   `getToken()`
-   `handleRedirect()`

Inline script in `index.html` will handle the UI state switching (Loading -> Content).

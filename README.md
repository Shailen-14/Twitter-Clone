# Full-Stack Twitter Clone (In Development)

A responsive social media web application featuring secure user authentication, complex social graph logic, and cloud-based media management. 

**Project Status:** The backend RESTful API is 100% complete, fully functional, and tested. The React frontend user interface is currently under active development as a hands-on environment to master client-side state management and asynchronous data fetching.

---

## Features

### Backend Architecture (Complete)
*   **Secure Authentication:** User signup and login powered by **JSON Web Tokens (JWT)** with protected API routes.
*   **Social Graph Logic:** Engineered complex Mongoose schemas to support asymmetric relationships (**Follow/Unfollow** mechanics).
*   **Interactions:** Dynamic, real-time **Post-Liking** system utilizing optimized database queries.
*   **Cloud Media Storage:** Direct integration with the **Cloudinary API** for secure asset handling, programmatic image uploads, and automated image optimization (profile pictures and tweet media).
*   **Data Integrity:** Robust NoSQL schemas designed via Mongoose to effectively manage data modeling, referencing and deep querying.

### Frontend UI (In Progress)
*   Responsive layout being built using **React.js**.
*   Implementing client-side routing, state management, and connection to the live authentication endpoints.

---

##  Tech Stack

*   **Frontend:** React.js, HTML5, CSS3, JavaScript (ES6+)
*   **Backend:** Node.js, Express.js
*   **Database & ORM:** MongoDB, Mongoose
*   **Authentication:** JSON Web Tokens (JWT), Bcrypt (Password Hashing)
*   **Media Management:** Cloudinary API

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open your browser to the local development URL

## Features:
- **Login Form**: A form with username and password fields.
- **Formik Validation**: Validates that both fields are required and shows error messages if invalid.
- **Session Management**: On successful login, user credentials are stored in `localStorage`, and the user is redirected to the `/invoice` page.
- **Auto-Login**: If a valid session exists in `localStorage`, the user is automatically redirected to the `/invoice` page.
- **Logout**: A logout button clears the session from `localStorage` and redirects the user back to the login page.
- **Data Persistence**: Form data is saved in `localStorage` and pre-populated when revisiting the page.

## Dependencies:
- `formik`: For managing forms and validation.
- `yup`: For input validation.
- `react-router-dom`: For routing.
- `tailwindcss`: For styling.


## Technology Stack:
- **React**: For building the user interface.
- **Formik**: For form management and validation.
- **Yup**: For input validation.
- **LocalStorage**: For data persistence across page reloads.
- **Tailwind CSS**: For responsive, clean UI styling.

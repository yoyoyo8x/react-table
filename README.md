React Table App: Infinite Scroll & CRUD

Overview
A React app with a table supporting lazy loading, infinite scroll, and CRUD (Add, Edit, Delete). Fetches dummy JSON data, adds sequential no and random createdDate. Built with Vite for fast dev.
Features

Infinite Scroll: Loads 20 rows initially; more on scroll-to-bottom via IntersectionObserver.
CRUD:

Add: Modal form prepends new row (auto id, createdDate, no:1).
Edit: Modal for updates.
Delete: Remove row with confirmation, re-numbers list.

Responsive Ant Design Table.
Redux for state, React Hook Form for validation.

Tech Stack

React 18+, Vite, TypeScript
Redux Toolkit, Ant Design, React Hook Form

Quick Start
Prerequisites

Node.js v18+

Install & Run
bashgit clone <repo-url>
cd react-table-app
npm install
npm run dev # http://localhost:5173
Build
bashnpm run build # Outputs to /dist
npm run preview # Local preview
Usage

Scroll table bottom → Loads more data.
"Add New Row" → Fill modal → Submit (appears at top).
Edit/Delete: Per-row buttons (extend as needed).

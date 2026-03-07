Request
↓
Middleware
↓
Route
↓
Controller
↓
Service
↓
Database
↓
Response

---

Project structure industry level

project/
│
├── src/
│ │
│ ├── config/
│ │ └── db.js
│ │
│ ├── controllers/
│ │ └── user.controller.js
│ │
│ ├── routes/
│ │ └── user.routes.js
│ │
│ ├── services/
│ │ └── user.service.js
│ │
│ ├── models/
│ │ └── user.model.js
│ │
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ └── logger.middleware.js
│ │
│ ├── utils/
│ │ └── helper.js
│ │
│ ├── validators/
│ │ └── user.validator.js
│ │
│ ├── app.js
│ └── server.js
│
├── .env
├── package.json
└── README.md

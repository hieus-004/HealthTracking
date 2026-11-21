# 🏋️‍♂️ HealthTracking — Full-Stack Health & Workout Management System

**HealthTracking** is a full-stack web application designed to automate daily nutrition tracking, generate personalized workout routines, and evaluate biomechanical injury risks based on individual joint pain history.

---

## 🚀 Key Features

### 1. Automated Nutrition Tracking
* **Adaptive Macro Calculation:** Automatically computes BMR, TDEE, and daily macronutrient targets (Protein, Carbs, Fat) tailored to user fitness goals (*Lose Weight, Gain Muscle, Maintain*). Dynamically selects between two clinical formulas:
  * **Cunningham Formula:** Used when body composition metrics (Body Fat % and Skeletal Muscle Mass) are available.
  * **Mifflin-St Jeor Formula:** Fallback when only standard body metrics (Weight, Height, Age, Gender) are provided.
* **Real-Time Barcode Scanner:** Integrates in-browser camera scanning via `Html5Qrcode` connected to the **Open Food Facts API** for instant food lookup and meal logging.

### 2. Workout Planning & Biomechanical Risk Assessment
* **Risk Score Algorithm:** Evaluates exercise safety by cross-referencing the user's joint pain map with exercise strain and technical complexity using the *"weakest link"* (`Max`) principle:
  $$\text{RiskScore} = \min\left(10, \operatorname{round}\left(\max_{j \in J} \left[ (\text{Strain}_j \times M_{\text{injury}, j} \times 0.5) + (\text{Complexity} \times 0.3) \right]\right)\right)$$
* **Automated Safety Classification:** Tags exercises as **SAFE** (< 4.0), **CAUTION** (4.0 – 7.9), or **DANGER** (≥ 8.0) to prevent injury during training.
* **Workout Generator:** Supports structured training splits such as Push/Pull/Legs (PPL) and Upper/Lower.

### 3. AI Assistant (Bio-Intelligence Terminal)
* Built as a floating terminal UI so users can ask nutrition and workout questions without leaving their active dashboard workflow.
* Backend acts as a secure proxy connecting to an LLM API for real-time, context-aware responses.

### 4. Automated Reporting (PDF & SMTP)
* Exports personalized workout plans into formatted **PDF** reports.
* Uses **JavaMailSender (SMTP)** to automatically dispatch PDF reports directly to the user's email.

### 5. Security & Access Control
* Stateless authentication powered by **Spring Security & JWT**.
* Role-Based Access Control (RBAC) across 3 tiers: `ADMIN`, `USER`, and `GUEST`.

---

## 🛠️ Tech Stack

| Layer | Technologies & Libraries |
| :--- | :--- |
| **Backend** | Java, Spring Boot, Spring MVC, Spring Data JPA, Hibernate, Spring Security, JWT |
| **Frontend** | React, TypeScript, Tailwind CSS, Axios, `Html5Qrcode` |
| **Database** | MySQL |
| **Integrations & Utilities** | Open Food Facts API, LLM API, JavaMailSender (SMTP), PDF Generator |

---

## 🏗️ System Architecture

Built on a **Client-Server** model following a standard 3-tier architecture on the backend:
* **Controller Layer:** Exposes RESTful endpoints, handles request validation, and returns DTOs.
* **Service Layer:** Encapsulates core business logic (macro calculations, Risk Score algorithm, PDF/email automation, external API calls).
* **Repository Layer:** Manages database persistence with MySQL via Spring Data JPA and Hibernate.

---

## ⚙️ Getting Started

### Prerequisites
* **JDK:** 17+
* **Node.js:** 18+
* **MySQL:** 8.0+
* **Maven:** 3.8+

### 1. Clone the Repository
```bash
git clone [https://github.com/](https://github.com/)<username>/HealthTracking.git
cd HealthTracking
```
### 2. Backend Setup (Spring Boot)
1. Create a new MySQL database (e.g., `health_tracking`).
2. Update `backend/src/main/resources/application.properties` with your credentials:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/health_tracking
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# SMTP Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD

# JWT & AI API Keys
jwt.secret=YOUR_JWT_SECRET_KEY
ai.api.key=YOUR_LLM_API_KEY
```
Run the application:
```Bash
cd backend
mvn spring-boot:run
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` (or the port shown in your terminal) to view the app.

---

## 🔮 Future Roadmap
* **Mobile App & Wearables:** Build a React Native mobile client with automated syncing via Apple Health, Google Fit, and smartwatches.
* **Machine Learning:** Collect real-world user injury data to dynamically optimize Risk Score weights.
* **AI Vision & OCR:** Add OCR scanning for printed InBody sheets and Computer Vision for real-time exercise form analysis.

# AI Crop Advisor

Full stack AI system for plant disease detection and crop recommendations.
Built with React, Node.js, FastAPI, and machine learning models.

---

## Overview

This project solves a real problem. Farmers often lack quick diagnosis and guidance for plant health.
The system provides two modes:

• image-based disease detection using CNN
• context-based recommendations using structured data

It stores predictions and supports an admin dashboard for analytics.

---

## Features

### User Side

• upload plant image for disease detection
• fill form for crop recommendations
• view prediction history

### Admin Side

• view analytics of predictions
• track most common diseases
• monitor user activity
• send notifications

---

## Tech Stack

Frontend
• React

Backend
• Node.js
• Express

AI Service
• FastAPI
• TensorFlow CNN model
• scikit-learn model

Database
• MongoDB or PostgreSQL

---

## System Architecture

User → React → Express API → FastAPI AI Service → Database → Response

Key design decision: AI service is separated from backend for scalability.

---

## AI Models

### 1. Image Model (CNN)

• input size: 128x128
• layers: Conv2D, MaxPooling, Dropout, Dense
• output: softmax classification
• accuracy: ~93 percent

### 2. Context Model

• input: location, crop, growth stage, season
• algorithm: classical ML (RandomForest or KNN)
• output: recommendation category

---

## API Endpoints

### Auth

POST /api/auth/register
POST /api/auth/login

### Prediction

POST /api/predict/image
POST /api/predict/context
GET /api/predictions

### Admin

GET /api/admin/stats
GET /api/admin/users
POST /api/admin/notify

---

## Project Structure

/backend
/controllers
/routes
/models
/middleware
/services

/frontend
/components
/pages

/ai-service
main.py
requirements.txt

---

## Setup Instructions

### Backend

cd backend
npm install
npm run dev

---

### Frontend

cd frontend
npm install
npm start

---

### AI Service

cd ai-service
py -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

---

## Key Challenges Solved

• class imbalance reduced model bias
• data preprocessing pipeline for inference
• integration of ML models into API
• clean separation of services

---

## What I Learned

• full stack system design
• API design and integration
• ML model deployment
• debugging real world issues

---

## Future Improvements

• add real-time notifications
• deploy models on GPU
• improve dataset size
• add weather-based recommendations

---

## Demo

 screenshots or video will be link here

---

## Author

Hanan
Computer Science Student
Full stack + AI developer

---

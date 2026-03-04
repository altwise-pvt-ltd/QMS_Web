# NC Service API Documentation

This document describes the API calls implemented in `ncService.js` for handling Non-Conformance (NC) operations.

## Service: `ncService`

### 1. Create Non-Conformance
- **Method:** `createNC`
- **Endpoint:** `POST /NonConformance/CreateNonConformance`
- **Description:** Submits a new NC entry.
- **Payload:** `FormData` (contains NC details and evidence documents).
- **Headers:** `Content-Type: multipart/form-data`

### 2. Get All Non-Conformances
- **Method:** `getNCs`
- **Endpoint:** `GET /NonConformance/GetAllNonConformances`
- **Description:** Retrieves a list of all NC entries.

### 3. Update Non-Conformance
- **Method:** `updateNC`
- **Endpoint:** `PUT /NonConformance/UpdateNonConformance/${id}`
- **Description:** Updates an existing NC entry.
- **Params:** `id` (NC ID)
- **Payload:** `FormData` (contains updated NC details and evidence documents).
- **Headers:** `Content-Type: multipart/form-data`

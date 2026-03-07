# Staff Competence & Document Upload Specification

This document details the file upload requirements for staff competence records and personal documents. This information is intended for the development of a Cloudflare Worker to handle R2 storage uploads.

## Endpoint & Format
- **Current Backend Endpoint**: `/StaffDocuments/StaffDetailsList`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`

## File Upload Mapping

The following table maps the frontend form fields to the `FormData` keys used during submission.

| Document Category | Frontend Field | FormData Key | File Type (Expected) |
| :--- | :--- | :--- | :--- |
| **Identification** | `passportPhoto` | `PassportPhoto` | Image (JPG, PNG) |
| **Professional** | `cv` | `CV` | PDF, DOCX |
| **Qualifications** | `qualifications[i].file` | `Qualifications[i].File` | PDF, Image |
| **Appointment** | `appointmentDocuments[i].file` | `Appointments[i].File` | PDF, Image |
| **Medical** | `medicalRecords[i].certificate` | `Medicals[i].File` | PDF, Image |
| **Vaccination** | `vaccinationRecords[i].file` | `Vaccinations[i].File` | PDF, Image |
| **Training (Induction)**| `trainingRecords[i].inductionTraining` | `TrainingRecords[i].inductionTraining` | PDF, Image |
| **Training (Competency)**| `trainingRecords[i].competencyTraining` | `TrainingRecords[i].competencyTraining` | PDF, Image |

## Detailed Data Structure

### 1. Simple Files
- `PassportPhoto`: Single file object.
- `CV`: Single file object.

### 2. Indexed Arrays (ASP.NET Core Binding)
The following fields are submitted using indexed naming conventions for standard model binding:

#### Qualifications
- `Qualifications[i].File`: The actual document file.
- `Qualifications[i].DocumentTitle`: String (e.g., "Bachelors Degree").

#### Appointments
- `Appointments[i].File`: The actual document file.
- `Appointments[i].DocumentTitle`: String (e.g., "Offer Letter").

#### Medicals
- `Medicals[i].File`: The actual certificate file.
- `Medicals[i].RecordTitle`: String (e.g., "Health Clearance").
- `Medicals[i].IssueDate`: Date String (YYYY-MM-DD).

#### Vaccinations
- `Vaccinations[i].File`: The actual certificate file.
- `Vaccinations[i].CertificateName`: String (e.g., "Hepatitis B").
- `Vaccinations[i].DoseDate`: Date String (YYYY-MM-DD).

#### Training Records
- `TrainingRecords[i].title`: String (e.g., "ISO 9001 Training").
- `TrainingRecords[i].inductionTraining`: File (Induction proof).
- `TrainingRecords[i].competencyTraining`: File (Competency proof).

## Staff Identification
All document uploads for an existing staff member must include the `StaffId`:
- **Key**: `StaffId`
- **Value**: Number/String (ID of the staff member).

## Implementation Note for Cloudflare Worker
The worker should be prepared to:
1.  Parse the `multipart/form-data` body.
2.  Extract the files corresponding to the keys listed above.
3.  Upload them to an R2 bucket using a structured path (e.g., `staff/{StaffId}/{category}/{filename}`).
4.  Return the R2 public/signed URLs back to the frontend so they can be saved in the primary database.


export const CAPA_QUESTIONS = {
  "Pre-Analytical": {
    "Vein puncture failure": [
      {
        question: "Was the patient properly identified before sample collection?",
        suggestionsYes: {
          rootCause: "Standard operating procedure followed.",
          correctiveAction: "No action required.",
          preventiveAction: "Maintain current identification practice."
        },
        suggestionsNo: {
          rootCause: "Patient identification protocol not strictly followed.",
          correctiveAction: "Re-identify the patient and recollect the sample.",
          preventiveAction: "Retrain phlebotomy staff on the two-identifier process."
        }
      },
      {
        question: "Was the tourniquet applied for more than one minute?",
        suggestionsYes: {
          rootCause: "Delayed sample collection or difficult vein access.",
          correctiveAction: "Release tourniquet and wait before retrying.",
          preventiveAction: "Training on efficient vein selection and collection techniques."
        },
        suggestionsNo: {
          rootCause: "Procedure completed within acceptable timeframe.",
          correctiveAction: "Proceed with sample handling.",
          preventiveAction: "Standard practice maintained."
        }
      },
      {
        question: "Was the phlebotomist adequately trained for the specific procedure?",
        suggestionsYes: {
          rootCause: "Competency verified.",
          correctiveAction: "Maintain current staffing level.",
          preventiveAction: "Continuous professional development."
        },
        suggestionsNo: {
          rootCause: "Assigning complex procedures to inexperienced staff.",
          correctiveAction: "Assign an experienced staff member to supervise.",
          preventiveAction: "Implement a competency assessment for various sample types."
        }
      },
      {
        question: "Was there any visible hematoma at the puncture site?",
        suggestionsYes: {
          rootCause: "Improper needle angle or lack of post-puncture pressure.",
          correctiveAction: "Apply immediate pressure and cold pack to the site.",
          preventiveAction: "Provide training on proper needle insertion angles."
        },
        suggestionsNo: {
          rootCause: "Successful venipuncture without trauma.",
          correctiveAction: "No intervention needed.",
          preventiveAction: "Monitor site for delayed reactions."
        }
      }
    ],
    "Typographic error": [
      {
        question: "Was double-verification performed before data entry completion?",
        suggestionsYes: {
          rootCause: "Dual-review process successfully followed.",
          correctiveAction: "No corrections required.",
          preventiveAction: "Reinforce importance of double-verification."
        },
        suggestionsNo: {
          rootCause: "Lack of a dual-review process for manual entries.",
          correctiveAction: "Cross-check the entered data with the source document.",
          preventiveAction: "Implement mandatory double-entry or peer review."
        }
      },
      {
        question: "Was the source document illegible or poorly formatted?",
        suggestionsYes: {
          rootCause: "Poor handwriting or suboptimal form design.",
          correctiveAction: "Request clarification from the source department.",
          preventiveAction: "Transition to electronic requisition forms."
        },
        suggestionsNo: {
          rootCause: "Clear and standard documentation provided.",
          correctiveAction: "No clarification needed.",
          preventiveAction: "Standards for documentation maintained."
        }
      },
      {
        question: "Was proofreading conducted after final report generation?",
        suggestionsYes: {
          rootCause: "Final check protocol successfully followed.",
          correctiveAction: "Verify results match source.",
          preventiveAction: "Maintain proofreading schedule."
        },
        suggestionsNo: {
          rootCause: "Time pressure leading to skipped verification steps.",
          correctiveAction: "Review and re-issue the corrected report.",
          preventiveAction: "Allocate dedicated time for report verification."
        }
      },
      {
        question: "Was the staff member multitasking during critical data entry?",
        suggestionsYes: {
          rootCause: "High workload or inadequate workspace organization.",
          correctiveAction: "Recenter focus on the task and verify entries.",
          preventiveAction: "Establish a 'no-interruption zone' for data entry."
        },
        suggestionsNo: {
          rootCause: "Focused data entry without distractions.",
          correctiveAction: "Proceed with routine verification.",
          preventiveAction: "Maintain work environment standards."
        }
      }
    ],
    "Wrong sample identification": [
      {
        question: "Were labels applied at the bedside or point of collection?",
        suggestionsYes: {
          rootCause: "Point-of-care labeling protocol followed.",
          correctiveAction: "No action required.",
          preventiveAction: "Compliance audit for bedside labeling."
        },
        suggestionsNo: {
          rootCause: "Batch labeling performed away from the patient.",
          correctiveAction: "Discard mislabeled tubes and recollect correctly.",
          preventiveAction: "Strict enforcement of the bedside labeling policy."
        }
      },
      {
        question: "Was any tube left unlabeled during the transport process?",
        suggestionsYes: {
          rootCause: "Disorganization during high-volume collection rounds.",
          correctiveAction: "Secure the samples and verify identity through a supervisor.",
          preventiveAction: "Use portable barcode printers for real-time labeling."
        },
        suggestionsNo: {
          rootCause: "Complete labeling achieved before transport.",
          correctiveAction: "No additional labeling required.",
          preventiveAction: "Maintain existing workflow."
        }
      },
      {
        question: "Was verbal confirmation obtained from the patient?",
        suggestionsYes: {
          rootCause: "Verbal ID verification standard maintained.",
          correctiveAction: "No action required.",
          preventiveAction: "Periodic training on patient communication."
        },
        suggestionsNo: {
          rootCause: "Assumed patient identity in a familiar setting.",
          correctiveAction: "Stop and verify identity using multiple identifiers.",
          preventiveAction: "Incorporate verbal confirmation into phlebotomy training."
        }
      },
      {
        question: "Was there a mismatch in the patient's wristband information?",
        suggestionsYes: {
          rootCause: "Administrative error during admission.",
          correctiveAction: "Contact nursing unit to fix wristband.",
          preventiveAction: "Implement barcode scanning step for patient matching."
        },
        suggestionsNo: {
          rootCause: "Wristband data matches system records.",
          correctiveAction: "Proceed with collection.",
          preventiveAction: "Regular checks on wristband data integrity."
        }
      }
    ],
    "Incomplete form": [
      {
        question: "Was the requisition form completely filled by the requester?",
        suggestionsYes: {
          rootCause: "Complete documentation provided.",
          correctiveAction: "No action required.",
          preventiveAction: "Maintain training on documentation."
        },
        suggestionsNo: {
          rootCause: "Inadequate training of clinical staff on requirements.",
          correctiveAction: "Return the form for completion or call requester.",
          preventiveAction: "Clearly mark mandatory fields and provide education."
        }
      },
      {
        question: "Was any critical clinical information missing from the request?",
        suggestionsYes: {
          rootCause: "Oversight by the ordering clinician.",
          correctiveAction: "Interview the clinician or review patient file.",
          preventiveAction: "Integrate clinical decision support into ordering."
        },
        suggestionsNo: {
          rootCause: "Comprehensive clinical data provided.",
          correctiveAction: "No additional info needed.",
          preventiveAction: "SOP maintained."
        }
      },
      {
        question: "Were all mandatory fields clearly marked on the form?",
        suggestionsYes: {
          rootCause: "Form design supports data collection.",
          correctiveAction: "No action required.",
          preventiveAction: "Monitor form usage."
        },
        suggestionsNo: {
          rootCause: "Suboptimal design of manual requisition forms.",
          correctiveAction: "Manually highlight the missing fields.",
          preventiveAction: "Redesign forms with 'Required' indicators."
        }
      },
      {
        question: "Was the form illegible due to poor handwriting?",
        suggestionsYes: {
          rootCause: "Clinician haste or lack of standardized entry methods.",
          correctiveAction: "Request a digitally printed or clearer copy.",
          preventiveAction: "Mandate the use of LIS/HIS for all test requests."
        },
        suggestionsNo: {
          rootCause: "Legible requisition provided.",
          correctiveAction: "Proceed with entry.",
          preventiveAction: "No change needed."
        }
      }
    ],
    "Sample labeling error": [
      {
        question: "Were all required patient identifiers present on the label?",
        suggestionsYes: {
          rootCause: "Identifier standards met.",
          correctiveAction: "Proceed to analysis.",
          preventiveAction: "Continue identifier audits."
        },
        suggestionsNo: {
          rootCause: "Printer settings issue or incomplete labeling.",
          correctiveAction: "Re-label the sample after verifying identity.",
          preventiveAction: "Automated label generation with mandatory fields."
        }
      },
      {
        question: "Was the label securely and correctly attached to the tube?",
        suggestionsYes: {
          rootCause: "Labeling application successful.",
          correctiveAction: "Proceed to transport.",
          preventiveAction: "Monitor label adhesion."
        },
        suggestionsNo: {
          rootCause: "Poor quality adhesive or improper label placement.",
          correctiveAction: "Secure the label or re-print and re-attach.",
          preventiveAction: "Evaluate higher-quality labels and staff training."
        }
      },
      {
        question: "Was the collection date and time included on the label?",
        suggestionsYes: {
          rootCause: "Timestamp protocol followed.",
          correctiveAction: "No action required.",
          preventiveAction: "Standard practice maintained."
        },
        suggestionsNo: {
          rootCause: "Oversight during the collection process.",
          correctiveAction: "Update digital record and verify with collector.",
          preventiveAction: "Require date/time entry in the mobile app."
        }
      },
      {
        question: "Was there a barcode scanning error during receipt?",
        suggestionsYes: {
          rootCause: "Damaged barcode or scanner hardware failure.",
          correctiveAction: "Manually enter the ID and check for label issues.",
          preventiveAction: "Regular maintenance of printers and scanners."
        },
        suggestionsNo: {
          rootCause: "Seamless barcode scanning achieved.",
          correctiveAction: "Proceed to processing.",
          preventiveAction: "Standard device maintenance."
        }
      }
    ]
  },
  "Analytical": {
    "Wrong sample processed": [
      {
        question: "Was barcode scanning utilized for analyzer loading?",
        suggestionsYes: {
          rootCause: "Automated verification process followed.",
          correctiveAction: "Proceed with analysis.",
          preventiveAction: "Continue barcode-mandatory policy."
        },
        suggestionsNo: {
          rootCause: "Manual loading bypassing the barcode system.",
          correctiveAction: "Abort the run and re-load using scanner.",
          preventiveAction: "Configure analyzers to refuse samples without a scan."
        }
      },
      {
        question: "Was any sample processed in the wrong rack position manually?",
        suggestionsYes: {
          rootCause: "Human error during manual rack preparation.",
          correctiveAction: "Stop processing and repeat correctly.",
          preventiveAction: "Implement automated track systems."
        },
        suggestionsNo: {
          rootCause: "Rack positions matched loading instructions.",
          correctiveAction: "No corrections required.",
          preventiveAction: "Maintain verification steps."
        }
      },
      {
        question: "Was there a double-check of the sample ID before analysis?",
        suggestionsYes: {
          rootCause: "Verification protocols strictly observed.",
          correctiveAction: "Proceed with confidence.",
          preventiveAction: "Spot-check verification compliance."
        },
        suggestionsNo: {
          rootCause: "Over-reliance on automated systems without checks.",
          correctiveAction: "Verify current batch against loading list.",
          preventiveAction: "Introduce mandatory scan-and-verify for manual loads."
        }
      },
      {
        question: "Was the analyzer alerted to a mismatch in sample type?",
        suggestionsYes: {
          rootCause: "Incorrect tube used for the requested test.",
          correctiveAction: "Identify correct tube and re-run test.",
          preventiveAction: "Staff training on sample-test alignment."
        },
        suggestionsNo: {
          rootCause: "Sample types correctly matched requests.",
          correctiveAction: "Proceed with analysis.",
          preventiveAction: "Monitor sample type consistency."
        }
      }
    ],
    "Random error": [
      {
        question: "Were repeat measurements performed for outliers?",
        suggestionsYes: {
          rootCause: "Repeat measurement protocols followed.",
          correctiveAction: "Check reproducibility.",
          preventiveAction: "Maintain outlier handling guidelines."
        },
        suggestionsNo: {
          rootCause: "Atypical sample matrix or temporary glitch.",
          correctiveAction: "Repeat the test and compare results.",
          preventiveAction: "Establish clear protocols for outlier repeats."
        }
      },
      {
        question: "Was there any visible bubble or clot in the sample?",
        suggestionsYes: {
          rootCause: "Poor sample quality or inadequate centrifugation.",
          correctiveAction: "Remove the clot or re-centrifuge.",
          preventiveAction: "Enhance centrifugation protocols."
        },
        suggestionsNo: {
          rootCause: "Clean sample prepared for analysis.",
          correctiveAction: "Analyze sample without interference.",
          preventiveAction: "Maintain pre-analytical standards."
        }
      },
      {
        question: "Was the instrument calibration current at the time of testing?",
        suggestionsYes: {
          rootCause: "Calibration schedule successfully maintained.",
          correctiveAction: "No action required.",
          preventiveAction: "Continue monitoring calibration alerts."
        },
        suggestionsNo: {
          rootCause: "Calibration schedule not maintained.",
          correctiveAction: "Stop testing and perform calibration.",
          preventiveAction: "Automated LIS alerts for upcoming calibrations."
        }
      },
      {
        question: "Was there a reagent probe failure during the run?",
        suggestionsYes: {
          rootCause: "Mechanical wear or lack of routine maintenance.",
          correctiveAction: "Service probe and repeat affected samples.",
          preventiveAction: "Adhere to manufacturer's maintenance schedule."
        },
        suggestionsNo: {
          rootCause: "Probe functioned without obstruction.",
          correctiveAction: "Proceed with run.",
          preventiveAction: "Standard probe cleaning protocol."
        }
      }
    ],
    "Systematic error": [
      {
        question: "Was the calibration within the manufacturer's specification?",
        suggestionsYes: {
          rootCause: "Specifications met for the current run.",
          correctiveAction: "Proceed to patient testing.",
          preventiveAction: "Log specification targets."
        },
        suggestionsNo: {
          rootCause: "Reagent lot variation or instrument drift.",
          correctiveAction: "Recalibrate instrument and verify with QC.",
          preventiveAction: "Daily monitoring of calibration trends."
        }
      },
      {
        question: "Was a shift in QC values observed over the last three runs?",
        suggestionsYes: {
          rootCause: "Gradual deterioration of reagents or lamp.",
          correctiveAction: "Investigate components and reagent integrity.",
          preventiveAction: "Implement Levey-Jennings chart review."
        },
        suggestionsNo: {
          rootCause: "QC values stable and within range.",
          correctiveAction: "Release patient results.",
          preventiveAction: "Maintain current QC monitoring frequency."
        }
      },
      {
        question: "Were calibrators handled and stored correctly?",
        suggestionsYes: {
          rootCause: "Storage and handling standards maintained.",
          correctiveAction: "Proceed with calibration.",
          preventiveAction: "Monthly audit of storage logs."
        },
        suggestionsNo: {
          rootCause: "Temperature deviation or improper reconstitution.",
          correctiveAction: "Discard current and use new vial.",
          preventiveAction: "Log and audit storage temperatures daily."
        }
      },
      {
        question: "Was a new reagent lot used without verification?",
        suggestionsYes: {
          rootCause: "Haste in reagent replacement.",
          correctiveAction: "Perform lot-to-lot comparison.",
          preventiveAction: "Mandatory verification before routine use."
        },
        suggestionsNo: {
          rootCause: "Lot verification successfully completed.",
          correctiveAction: "Proceed with new lot.",
          preventiveAction: "Maintain reagent lot verification protocol."
        }
      }
    ],
    "IQC failure": [
      {
        question: "Was the QC material within its expiration date?",
        suggestionsYes: {
          rootCause: "Inventory standards strictly observed.",
          correctiveAction: "Proceed to perform QC.",
          preventiveAction: "Continue FIFO inventory system."
        },
        suggestionsNo: {
          rootCause: "Inventory management failure.",
          correctiveAction: "Discard expired and use a current lot.",
          preventiveAction: "First-in-first-out inventory system."
        }
      },
      {
        question: "Were Westgard rules violated (e.g., 1-2s, 1-3s)?",
        suggestionsYes: {
          rootCause: "Random or systematic instrument/reagent issue.",
          correctiveAction: "Follow troubleshooting guide.",
          preventiveAction: "Automated IQC rule evaluation."
        },
        suggestionsNo: {
          rootCause: "QC passed within Westgard limits.",
          correctiveAction: "Begin patient sample analysis.",
          preventiveAction: "Continue rule monitoring."
        }
      },
      {
        question: "Did the operator take corrective action before reporting results?",
        suggestionsYes: {
          rootCause: "Standard protocols for IQC failure followed.",
          correctiveAction: "Re-run samples after fix.",
          preventiveAction: "Maintain current corrective workflows."
        },
        suggestionsNo: {
          rootCause: "Pressure to release results bypassing QC.",
          correctiveAction: "Recall any released results.",
          preventiveAction: "Electronic lock on results until QC is passed."
        }
      },
      {
        question: "Was there a power surge or environmental fluctuation?",
        suggestionsYes: {
          rootCause: "Inadequate power backup or HVAC failure.",
          correctiveAction: "Stabilize environment and repeat QC.",
          preventiveAction: "Install UPS and automated monitoring systems."
        },
        suggestionsNo: {
          rootCause: "Environmental conditions remained stable.",
          correctiveAction: "Proceed with analysis.",
          preventiveAction: "Quarterly check of backup power systems."
        }
      }
    ],
    "EQAS failure": [
      {
        question: "Was the EQAS sample handled like a routine patient sample?",
        suggestionsYes: {
          rootCause: "Representative processing protocol followed.",
          correctiveAction: "Submit results per standard procedure.",
          preventiveAction: "Verify routine handling standards."
        },
        suggestionsNo: {
          rootCause: "Special handling leading to non-representative results.",
          correctiveAction: "Analyze difference in routine vs EQAS handling.",
          preventiveAction: "Staff training on 'blind' sample processing."
        }
      },
      {
        question: "Was there a delay in the delivery of EQAS samples?",
        suggestionsYes: {
          rootCause: "Courier or logistics issue.",
          correctiveAction: "Contact provider to check stability.",
          preventiveAction: "Better coordination with couriers."
        },
        suggestionsNo: {
          rootCause: "Samples delivered within stability window.",
          correctiveAction: "Process samples immediately.",
          preventiveAction: "Monitor delivery times."
        }
      },
      {
        question: "Was the root cause analysis performed for the unacceptable result?",
        suggestionsYes: {
          rootCause: "Quality improvement loop successfully closed.",
          correctiveAction: "Implement improvements identified.",
          preventiveAction: "Update SOP based on findings."
        },
        suggestionsNo: {
          rootCause: "Failure to prioritize external quality improvement.",
          correctiveAction: "Conduct investigation for failure.",
          preventiveAction: "Managerial review of all reports."
        }
      },
      {
        question: "Was a clerical error identified in result submission?",
        suggestionsYes: {
          rootCause: "Manual data entry or transcription error to portal.",
          correctiveAction: "Notify provider of transcription error.",
          preventiveAction: "Internal double-check before submission."
        },
        suggestionsNo: {
          rootCause: "Portal submission accurately matched records.",
          correctiveAction: "Await external report.",
          preventiveAction: "Standard submission review protocol."
        }
      }
    ]
  },
  "Post-Analytical": {
    "Printing error": [
      {
        question: "Was the report verified for completeness before printing?",
        suggestionsYes: {
          rootCause: "Report integrity verified successfully.",
          correctiveAction: "Proceed to physical dispatch.",
          preventiveAction: "Maintain verification workflow."
        },
        suggestionsNo: {
          rootCause: "Auto-print setting bypassing human verification.",
          correctiveAction: "Check master record and re-print full report.",
          preventiveAction: "Verification step for all multi-page reports."
        }
      },
      {
        question: "Was there a paper jam or ink depletion during printing?",
        suggestionsYes: {
          rootCause: "Lack of printer maintenance or supply checks.",
          correctiveAction: "Clear jam and re-print verification.",
          preventiveAction: "Daily printer inspection schedule."
        },
        suggestionsNo: {
          rootCause: "Printer functioned without mechanical failure.",
          correctiveAction: "Complete batch printing.",
          preventiveAction: "Monthly printer service schedule."
        }
      },
      {
        question: "Was the barcode on the report readable by the scanner?",
        suggestionsYes: {
          rootCause: "Barcode printing standard achieved.",
          correctiveAction: "Proceed to automated sorting.",
          preventiveAction: "Monitor barcode quality periodically."
        },
        suggestionsNo: {
          rootCause: "Low toner or alignment issues.",
          correctiveAction: "Adjust settings and re-print.",
          preventiveAction: "Regular barcode scannability tests."
        }
      },
      {
        question: "Were any results truncated or missing on the hard copy?",
        suggestionsYes: {
          rootCause: "CSS or layout formatting error in template.",
          correctiveAction: "Fix template and re-issue report.",
          preventiveAction: "Test report formats with outlier values."
        },
        suggestionsNo: {
          rootCause: "Full report content printed correctly.",
          correctiveAction: "No action required.",
          preventiveAction: "Maintain layout standards."
        }
      }
    ],
    "Urgent sample report": [
      {
        question: "Was the urgent sample flag recognized immediately by the staff?",
        suggestionsYes: {
          rootCause: "Urgent identification protocols successful.",
          correctiveAction: "Prioritize specimen processing.",
          preventiveAction: "Monitor flag recognition efficiency."
        },
        suggestionsNo: {
          rootCause: "Inadequate visual cues or alert system.",
          correctiveAction: "Manually expedite through workflow.",
          preventiveAction: "Implement color-coded racks and STAT alerts."
        }
      },
      {
        question: "Was there a delay in the technical verification of the result?",
        suggestionsYes: {
          rootCause: "Workload imbalance or shortage of senior staff.",
          correctiveAction: "Escalate for immediate review.",
          preventiveAction: "Prioritize urgent in verification queue."
        },
        suggestionsNo: {
          rootCause: "Verification completed within priority window.",
          correctiveAction: "Release report immediately.",
          preventiveAction: "Maintain priority staffing levels."
        }
      },
      {
        question: "Was the target TAT for urgent samples achieved?",
        suggestionsYes: {
          rootCause: "STAT workflow efficiency maintained.",
          correctiveAction: "Notify requester of result availability.",
          preventiveAction: "Verify TAT targets quarterly."
        },
        suggestionsNo: {
          rootCause: "System bottlenecks or equipment downtime.",
          correctiveAction: "Identify cause of delay and document impact.",
          preventiveAction: "Audit urgent TAT performance."
        }
      },
      {
        question: "Was the critical value protocol ignored for this report?",
        suggestionsYes: {
          rootCause: "Knowledge gap or loss of focus.",
          correctiveAction: "Initiate notification protocol immediately.",
          preventiveAction: "Mandatory notification fields for STAT."
        },
        suggestionsNo: {
          rootCause: "Critical value protocol followed implicitly.",
          correctiveAction: "Document notification recipient.",
          preventiveAction: "Continue critical value training."
        }
      }
    ],
    "Critical value reporting": [
      {
        question: "Was the clinician contacted within the specified timeframe?",
        suggestionsYes: {
          rootCause: "Critical notification standard met.",
          correctiveAction: "Document clinician response.",
          preventiveAction: "Maintain updated contact directory."
        },
        suggestionsNo: {
          rootCause: "Inaccurate contact info or communication failure.",
          correctiveAction: "Escalate contact to department head.",
          preventiveAction: "Update clinician contact directory quarterly."
        }
      },
      {
        question: "Was there a failure in the 'read-back' verification process?",
        suggestionsYes: {
          rootCause: "Incomplete communication protocol execution.",
          correctiveAction: "Ask recipient to read back results.",
          preventiveAction: "Standardized scripts for reporting."
        },
        suggestionsNo: {
          rootCause: "Read-back received and verified.",
          correctiveAction: "Log confirmation in LIS.",
          preventiveAction: "Audit read-back logs monthly."
        }
      },
      {
        question: "Was the time and recipient of the notification recorded?",
        suggestionsYes: {
          rootCause: "Notification logs successfully updated.",
          correctiveAction: "No action required.",
          preventiveAction: "Maintain documentation standards."
        },
        suggestionsNo: {
          rootCause: "Documentation oversight during critical event.",
          correctiveAction: "Retrieve and document details retroactively.",
          preventiveAction: "Mandatory timestamping in LIS."
        }
      },
      {
        question: "Was the report sent to the wrong department initially?",
        suggestionsYes: {
          rootCause: "Data entry error in patient location field.",
          correctiveAction: "Redirect and notify correct unit.",
          preventiveAction: "Real-time sync between HIS and lab."
        },
        suggestionsNo: {
          rootCause: "Department routing matched request.",
          correctiveAction: "Proceed with final dispatch.",
          preventiveAction: "Coordinate with HIS for dynamic updates."
        }
      }
    ],
    "Turnaround time (TAT)": [
      {
        question: "Was the sample receipt time logged correctly?",
        suggestionsYes: {
          rootCause: "Receipt logging protocol successful.",
          correctiveAction: "Proceed to processing queue.",
          preventiveAction: "Monitor log accuracy randomly."
        },
        suggestionsNo: {
          rootCause: "Late entry after manual receipt.",
          correctiveAction: "Adjust record and note reason.",
          preventiveAction: "Electronic time-stamping at receipt."
        }
      },
      {
        question: "Was there a technical breakdown of the main analyzer?",
        suggestionsYes: {
          rootCause: "System failure or lack of redundant equipment.",
          correctiveAction: "Switch to backup or outsource.",
          preventiveAction: "Tiered equipment redundancy plan."
        },
        suggestionsNo: {
          rootCause: "Analyzer operated continuously.",
          correctiveAction: "Proceed with routine runs.",
          preventiveAction: "Preventative maintenance compliance."
        }
      },
      {
        question: "Was the result verification prompt after analysis?",
        suggestionsYes: {
          rootCause: "Post-analytical review cycle met targets.",
          correctiveAction: "Dispatch reports.",
          preventiveAction: "Review verification metrics monthly."
        },
        suggestionsNo: {
          rootCause: "Bottleneck in post-analytical review stage.",
          correctiveAction: "Re-assign staff to verification.",
          preventiveAction: "Rules-based auto-verification for normals."
        }
      },
      {
        question: "Was there a logistics delay in sample transport?",
        suggestionsYes: {
          rootCause: "Courier scheduling conflict or transport failure.",
          correctiveAction: "Inform clinical unit of delay.",
          preventiveAction: "Route optimization for couriers."
        },
        suggestionsNo: {
          rootCause: "Transport times were within acceptable limits.",
          correctiveAction: "Process samples per priority.",
          preventiveAction: "Monthly courier performance audit."
        }
      }
    ],
    "Improper report dispatch": [
      {
        question: "Was the destination verified against the request form?",
        suggestionsYes: {
          rootCause: "Dispatch verification protocol followed.",
          correctiveAction: "Proceed to release.",
          preventiveAction: "Maintain manual check steps."
        },
        suggestionsNo: {
          rootCause: "Inattention to detail during bulk dispatch.",
          correctiveAction: "Recall mis-dispatched and redirect.",
          preventiveAction: "Barcode-based validation for routing."
        }
      },
      {
        question: "Was any report dispatched without proper confidentiality sealing?",
        suggestionsYes: {
          rootCause: "Supply shortage or lack of awareness.",
          correctiveAction: "Re-seal or secure reports.",
          preventiveAction: "Specialized confidentiality envelopes."
        },
        suggestionsNo: {
          rootCause: "Confidentiality sealed per lab standards.",
          correctiveAction: "No action needed.",
          preventiveAction: "Periodic training on information security."
        }
      },
      {
        question: "Was delivery confirmation obtained for the report?",
        suggestionsYes: {
          rootCause: "Recipient confirmation protocol successful.",
          correctiveAction: "Verify arrival in system.",
          preventiveAction: "Maintain tracking efficiency."
        },
        suggestionsNo: {
          rootCause: "Inadequate tracking system for delivery.",
          correctiveAction: "Contact recipient to verify arrival.",
          preventiveAction: "Digital delivery tracking and signatures."
        }
      },
      {
        question: "Was the report sent via an unencrypted email channel?",
        suggestionsYes: {
          rootCause: "Knowledge gap regarding data security.",
          correctiveAction: "Recall email or notify IT security.",
          preventiveAction: "Enforce secure portal access."
        },
        suggestionsNo: {
          rootCause: "Encryption applied per security standards.",
          correctiveAction: "Proceed with report archiving.",
          preventiveAction: "Bi-annual review of encryption protocols."
        }
      }
    ]
  }
};

export default CAPA_QUESTIONS;
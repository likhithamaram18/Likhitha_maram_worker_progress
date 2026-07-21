/**
 * data.js
 * -----------------------------------------------------------------------
 * Single source of truth for the Worker Progress Report application.
 * Nothing is hardcoded into the HTML — every value rendered on screen
 * originates from this object graph (or from user interaction that
 * mutates it). See render.js for the functions that read this object
 * and paint the DOM.
 * -----------------------------------------------------------------------
 */

const report = {
  meta: {
    orgName: "Workers Compensation Board",
    address: "333 Broadway, Winnipeg, MB R3C 4W3",
    phone: "(204) 954-4321",
    tollFree: "1-855-954-4321",
    website: "wcb.mb.ca",
    claimNo: "20042047",
    claimSuffix: "WP",
    reportTitle: "Worker Progress Report",
    totalPages: 3
  },

  worker: {
    name: "Madeleine Willson",
    workerAppId: "712041",
    submittedDate: "2024-03-19T19:21:00",
    reportDate: "2024-03-15"
  },

  returnToWork: {
    // one of: 'not-missed' | 'not-returned' | 'returned'
    status: "returned",
    returnDate: "2024-03-15",
    // one of: 'full-regular' | 'full-reduced' | 'modified-regular' | 'modified-reduced' | 'other'
    workingAs: "modified-reduced",
    otherDetail: "",
    goingComment: "Terrible. Testing Testing",
    expectedReturnDate: "",
    concerns: "",
    lastContactName: "",
    lastContactDate: ""
  },

  recovery: {
    // one of: 'not-recovered' | 'recovered'
    status: "recovered",
    comments: ""
  },

  painScale: {
    value: null,
    min: 1,
    max: 10
  },

  medical: {
    // one of: 'not-continuing' | 'continuing'
    status: "not-continuing",
    providerType: "",
    lastTreatment: { date: "", providerName: "" },
    nextTreatment: { date: "", providerName: "" },
    attendingFrequency: ""
  },

  medication: {
    // one of: 'not-taking' | 'taking'
    status: "not-taking",
    name: ""
  },

  exercises: {
    // one of: 'not-doing' | 'doing'
    status: "not-doing",
    list: ""
  },

  additionalInfo: {
    comments: "No info Testing Testing"
  },

  declaration: {
    acknowledged: false
  }
};

/** Static option sets used to generate checkbox / radio groups without hardcoding markup. */
const optionSets = {
  returnToWorkStatus: [
    { value: "not-missed", label: "I have not missed time from work" },
    { value: "not-returned", label: "I have not returned to work" },
    { value: "returned", label: "I returned to work on:", hasDate: true }
  ],
  workingAs: [
    { value: "full-regular", label: "Full duties, regular hours" },
    { value: "full-reduced", label: "Full duties, reduced hours" },
    { value: "modified-regular", label: "Modified duties, regular hours" },
    { value: "modified-reduced", label: "Modified duties, reduced hours" },
    { value: "other", label: "Other:", hasText: true }
  ],
  recoveryStatus: [
    { value: "not-recovered", label: "I have not fully recovered from my workplace injury." },
    { value: "recovered", label: "I have fully recovered from my workplace injury." }
  ],
  medicalStatus: [
    { value: "not-continuing", label: "I am not continuing to receive medical treatment for my workplace injury." },
    { value: "continuing", label: "I am continuing to receive medical treatment for my workplace injury from:", hasText: true }
  ],
  medicationStatus: [
    { value: "not-taking", label: "I am not taking medication for my workplace injury." },
    { value: "taking", label: "I am taking medication for my workplace injury:", hasText: true }
  ],
  exerciseStatus: [
    { value: "not-doing", label: "I am not doing home exercises for my workplace injury." },
    { value: "doing", label: "I am doing home exercises for my workplace injury." }
  ]
};

export const DEFAULT_TIMEZONE = {
  name: "(GMT+01:00) Central European Time - Paris",
  value: "Europe/Paris"
};

export const OSSA_IDS = [
  {
    id: 3,
    color: "#512da8",
    key: "Blocking"
  },
  {
    id: 2,
    color: "#8b60d8",
    key: "Non-blocking"
  },
  {
    id: 1,
    color: "#dbc1ff",
    key: "Information"
  }
];

export const CONTRIBUTION_STATUS = {
  DEVELOP: "develop",
  REVERSED: "reversed",
  INTEGRATED: "integrated",
  PUBLISHED: "published",
  REJECTED: "rejected"
};

export const CONTRIBUTION_FILTERS = {
  TYPE: "Type",
  SOFTWARE: "Software",
  AUTHOR: "Author",
  STATUS: "Status"
};

export const SEVERITY_TYPES = ["Major", "Minor", "Blocking", "None"];

export const REQUEST_TYPE = {
  INFORMATION: "Information",
  ADMINISTRATION: "Administration",
  ANOMALY: "Anomaly",
  OTHER: "Other"
};

export const REQUEST_TYPES = [
  REQUEST_TYPE.INFORMATION,
  REQUEST_TYPE.ADMINISTRATION,
  REQUEST_TYPE.ANOMALY,
  REQUEST_TYPE.OTHER
];

export const CONTRACT_STATUS = {
  EXPIRED: "expired",
  ACTIVE: "active",
  INACTIVE: "inactive"
};

export const CLIENT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive"
};

export const CONTRIBUTION_TYPES = ["Backport", "Correction", "Evolution"];

export const CONTRIBUTION_LINK_TYPES = ["Patch link", "binary link with the path", "Other"];

export const USER_TYPE = {
  EXPERT: "expert",
  BENEFICIARY: "beneficiary",
  ADMIN: "admin"
};

export const EXPERT_ROLE = {
  ADMIN: "admin",
  EXPERT: "expert"
};

const BENEFICIARY_ROLES = ["customer", "viewer"];
const EXPERT_ROLES = ["manager", "expert"];

export const USER_ROLES = {
  expert: EXPERT_ROLES,
  beneficiary: BENEFICIARY_ROLES
};

export const UPDATE_COMMENT = {
  title: {
    changed: "{author} changed the title from {oldValue} to {newValue}."
  },
  beneficiary: {
    changed: "{author} changed the beneficiary from {oldValue} to {newValue}."
  },
  responsible: {
    added: "{author} added the responsible {newValue}.",
    changed: "{author} changed the responsible from {oldValue} to {newValue}."
  },
  callNumber: {
    changed: "{author} changed the call number from {oldValue} to {newValue}."
  },
  meetingId: {
    changed: "{author} changed the meeting ID from {oldValue} to {newValue}."
  },
  participants: {
    changed: "{author} changed the participants list from {oldValue} to {newValue}.",
    added: "{author} added {newValue} to the participants list",
    removed: "{author} removed {oldValue} from the participants list"
  },
  type: {
    changed: "{author} changed the type from {oldValue} to {newValue}."
  },
  software: {
    changed: "{author} changed the software from {oldValue} to {newValue}.",
    added: "{author} added the software {newValue}.",
    removed: "{author} removed the software {oldValue}."
  },
  severity: {
    changed: "{author} changed the severity from {oldValue} to {newValue}.",
    added: "{author} added the severity {newValue}.",
    removed: "{author} removed the severity {oldValue}."
  },
  description: {
    changed: "{author} changed the description."
  },
  relatedRequests: {
    changed: "{author} changed the related requests from {oldValue} to {newValue}.",
    added: "{author} added {newValue} to the related requests",
    removed: "{author} removed {oldValue} from the related requests"
  }
};
export const UNDEFINED_DURATION = "P0D";

export const TICKET_STATUS = {
  NEW: "new",
  SUPPORTED: "supported",
  BYPASSED: "bypassed",
  RESOLVED: "resolved",
  CLOSED: "closed"
};

export const TICKET_STATUS_ID = {
  NEW: 0,
  SUPPORTED: 1,
  BYPASSED: 2,
  RESOLVED: 3,
  CLOSED: 4
};

export const ANOMALY_NEXT_STATUS = {
  new: "supported",
  supported: "bypassed",
  bypassed: "resolved",
  resolved: "closed"
};

export const NEXT_STATUS = {
  new: "supported",
  supported: "resolved",
  resolved: "closed"
};

export const CNS_TYPES = {
  SUPPORT: "supported",
  BYPASS: "bypassed",
  RESOLUTION: "resolved"
};

export const CNS_STATUS = {
  new: "cns.state.support",
  supported: "cns.state.resolution",
  resolved: "cns.state.closure",
  closed: "cns.state.closed"
};

export const ANOMALY_CNS_STATUS = {
  new: "cns.state.support",
  supported: "cns.state.bypass",
  bypassed: "cns.state.resolution",
  resolved: "cns.state.closure",
  closed: "cns.state.closed"
};

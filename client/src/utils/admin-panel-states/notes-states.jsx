// Central notes - no personal/studio separation
export const demoNotes = [
  {
    id: 1,
    title: "Quarterly Review Meeting Notes",
    content: "<p>Discussed Q4 goals and performance metrics. Team showed 15% improvement in customer satisfaction.</p><p><strong>Action items:</strong></p><ul><li>Reduce response time in support tickets</li><li>Schedule follow-up meeting</li></ul>",
    tags: ['meeting', 'urgent'],
    attachments: [],
    isPinned: true,
    createdAt: "2025-12-15T10:30:00",
    updatedAt: "2025-12-20T14:45:00"
  },
  {
    id: 2,
    title: "New Member Orientation Checklist",
    content: "<ol><li>Welcome package preparation</li><li>Training schedule setup</li><li>Facility tour arrangement</li><li>Equipment assignment</li><li>Introduction to team members</li></ol>",
    tags: ['member', 'todo'],
    attachments: [],
    isPinned: false,
    createdAt: "2025-12-10T09:15:00",
    updatedAt: "2025-12-10T09:15:00"
  },
  {
    id: 3,
    title: "Equipment Maintenance Schedule",
    content: "<h3>Weekly Maintenance</h3><ul><li>Check treadmill belts</li><li>Clean all surfaces</li><li>Test emergency stop buttons</li></ul><h3>Monthly Maintenance</h3><ul><li>Deep clean all equipment</li><li>Inspect cables and pulleys</li><li>Update maintenance log</li></ul>",
    tags: ['training'],
    attachments: [],
    isPinned: true,
    createdAt: "2025-12-01T08:00:00",
    updatedAt: "2025-12-18T16:30:00"
  },
  {
    id: 4,
    title: "Marketing Campaign Ideas",
    content: "<p>Ideas for the upcoming quarter:</p><ul><li>Social media challenge</li><li>Referral bonus program</li><li>Local partnership with health food stores</li></ul>",
    tags: ['ideas'],
    attachments: [],
    isPinned: false,
    createdAt: "2025-11-20T14:00:00",
    updatedAt: "2025-11-25T09:30:00"
  },
  {
    id: 5,
    title: "Staff Training Notes",
    content: "<p>Topics covered in today's training session:</p><ol><li>Customer service best practices</li><li>Emergency procedures review</li><li>New software features walkthrough</li></ol>",
    tags: ['training', 'meeting'],
    attachments: [],
    isPinned: false,
    createdAt: "2025-11-15T11:00:00",
    updatedAt: "2025-11-15T11:00:00"
  },
  {
    id: 6,
    title: "Budget Planning 2026",
    content: "<p>Key areas to focus on:</p><ul><li>Equipment upgrades</li><li>Marketing budget increase</li><li>Staff training programs</li><li>Facility improvements</li></ul>",
    tags: ['urgent', 'todo'],
    attachments: [],
    isPinned: false,
    createdAt: "2025-11-10T16:00:00",
    updatedAt: "2025-12-05T10:00:00"
  }
]

// Available tags for notes
export const notesTagsData = [
  { id: 'urgent', name: 'Urgent', color: '#ef4444' },
  { id: 'meeting', name: 'Meeting', color: '#3b82f6' },
  { id: 'ideas', name: 'Ideas', color: '#8b5cf6' },
  { id: 'todo', name: 'Todo', color: '#f59e0b' },
  { id: 'training', name: 'Training', color: '#10b981' },
  { id: 'member', name: 'Member', color: '#ec4899' },
]

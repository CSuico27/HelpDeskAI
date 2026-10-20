export const dashboardData = {
  stats: [
    { id: "open", label: "Open Tickets", value: 42, change: -8 },
    { id: "response", label: "Avg Response Time", value: "4m 12s", change: -15 },
    { id: "ai", label: "AI Resolution Rate", value: "68%", change: 5 },
    { id: "csat", label: "CSAT", value: "4.6/5", change: 2 },
  ],
  ticketsOverTime: [
    { date: "Mon", created: 24, resolved: 18 },
    { date: "Tue", created: 31, resolved: 25 },
    // ...
  ],
  byStatus: [
    { name: "Open", value: 42 },
    { name: "In Progress", value: 18 },
    { name: "Resolved", value: 120 },
  ],
  recentTickets: [
    { id: "T-1024", subject: "Can't reset password", status: "open", priority: "high", createdAt: "2026-10-18" },
    // ...
  ],
};
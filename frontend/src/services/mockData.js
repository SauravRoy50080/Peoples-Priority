// Mock responses shaped exactly like the backend's expected JSON.
// Used only when VITE_USE_MOCK=true, so you can build/demo the UI
// before backend/routes/dashboard.py is live.

export const mockStats = {
  total_submissions: 482,
  total_clusters: 17,
  top_category: 'Road',
  channels_breakdown: { whatsapp: 210, sms: 95, web: 120, voice: 57 },
};

export const mockPriorities = {
  last_updated: new Date().toISOString(),
  priorities: [
    {
      cluster_id: 'c1',
      rank: 1,
      label: 'Pothole repair on Station Road',
      category: 'Road',
      count: 64,
      wards: ['Ward 4', 'Ward 5'],
      final_score: 87,
      demand_score: 90,
      need_score: 82,
      urgency_score: 88,
      feasibility_score: 75,
      gemini_reasoning: 'High volume of repeated complaints with consistent location references.',
    },
    {
      cluster_id: 'c2',
      rank: 2,
      label: 'New water tank for Sector 9',
      category: 'Water',
      count: 41,
      wards: ['Ward 9'],
      final_score: 79,
      demand_score: 70,
      need_score: 85,
      urgency_score: 80,
      feasibility_score: 60,
      gemini_reasoning: 'Reports of dry taps cross-referenced with low tap-water coverage data.',
    },
    {
      cluster_id: 'c3',
      rank: 3,
      label: 'Vocational training centre vs. school upgrade',
      category: 'School',
      count: 28,
      wards: ['Ward 2', 'Ward 3'],
      final_score: 65,
      demand_score: 55,
      need_score: 70,
      urgency_score: 50,
      feasibility_score: 80,
      gemini_reasoning: 'Enrollment data suggests upgrade is more urgent than new vocational centre.',
    },
  ],
};

export const mockHeatmap = {
  points: [
    { lat: 25.594, lng: 85.137, weight: 5 },
    { lat: 25.601, lng: 85.142, weight: 3 },
    { lat: 25.585, lng: 85.128, weight: 4 },
  ],
};

export const mockClusterDetail = (id) => ({
  cluster_id: id,
  label: 'Pothole repair on Station Road',
  final_score: 87,
  justification: 'Repeated, geographically consistent complaints with high urgency language ("accident", "every day").',
  need_evidence: [
    'Road condition flagged in PWD maintenance backlog (2025)',
    'Accident report count: 3 in last 6 months near this stretch',
  ],
  sample_quotes: [
    'My daughter fell off her bike here last week.',
    'This road has not been repaired in 3 years.',
  ],
  channels_used: ['whatsapp', 'web', 'voice'],
});
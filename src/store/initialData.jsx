/**
 * Default configuration matching the user's current spreadsheet
 */
export const defaultConfig = {
  metrics: [
    { id: 'sub_jobs', name: 'Subscriptions Jobs to Build', weight: 2 },
    { id: 'custom_jobs', name: 'Custom Jobs to Build', weight: 3 },
    { id: 'active_projects', name: 'Active Projects', weight: 1 },
    { id: 'data_review', name: 'Final Data Review', weight: 1.5 },
    { id: 'waiting_approval', name: 'Jobs Waiting on Client Approval', weight: 0.5 },
  ],
  subjectiveMetrics: [
    { id: 'complexity', name: 'Overall Project Complexity Score', weight: 2, min: 1, max: 5 },
    { id: 'busy_feeling', name: '"I Feel This Busy" Score', weight: 2, min: 1, max: 5 },
  ],
  loadScoreWeight: 3,
};

export const defaultTeamMembers = ['Charles', 'Cambrie', 'Shea'];

/**
 * Historical data imported from the user's Excel spreadsheet
 */
export const historicalEntries = [
  {
    date: '2025-12-02',
    label: 'Week of 12/2/25',
    data: {
      Charles: {
        metrics: { sub_jobs: 1, custom_jobs: 1, active_projects: 0, data_review: 1, waiting_approval: 1 },
        subjective: { complexity: 5, busy_feeling: 5 },
      },
      Cambrie: {
        metrics: { sub_jobs: 0, custom_jobs: 2, active_projects: 0, data_review: 1, waiting_approval: 4 },
        subjective: { complexity: 0, busy_feeling: 0 },
      },
      Shea: {
        metrics: { sub_jobs: 1, custom_jobs: 1, active_projects: 0, data_review: 1, waiting_approval: 8 },
        subjective: { complexity: 3, busy_feeling: 4 },
      },
    },
  },
  {
    date: '2025-12-09',
    label: 'Week of 12/9/25',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 1.5, active_projects: 0, data_review: 2, waiting_approval: 3 },
        subjective: { complexity: 3, busy_feeling: 2 },
      },
      Cambrie: {
        metrics: { sub_jobs: 0, custom_jobs: 2, active_projects: 0, data_review: 1, waiting_approval: 4 },
        subjective: { complexity: 0, busy_feeling: 0 },
      },
      Shea: {
        metrics: { sub_jobs: 1, custom_jobs: 1, active_projects: 0, data_review: 1, waiting_approval: 8 },
        subjective: { complexity: 0, busy_feeling: 4 },
      },
    },
  },
  {
    date: '2025-12-16',
    label: 'Week of 12/16/25',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 0.5, active_projects: 0, data_review: 1, waiting_approval: 2 },
        subjective: { complexity: 3, busy_feeling: 2 },
      },
      Cambrie: {
        metrics: { sub_jobs: 1, custom_jobs: 0, active_projects: 0, data_review: 6, waiting_approval: 0 },
        subjective: { complexity: 4, busy_feeling: 2 },
      },
      Shea: {
        metrics: { sub_jobs: 1, custom_jobs: 0, active_projects: 0, data_review: 4, waiting_approval: 11 },
        subjective: { complexity: 4, busy_feeling: 3 },
      },
    },
  },
  {
    date: '2026-01-06',
    label: 'Week of 1/6/26',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 0.5, active_projects: 0, data_review: 1, waiting_approval: 2 },
        subjective: { complexity: 3, busy_feeling: 2 },
      },
      Cambrie: {
        metrics: { sub_jobs: 0, custom_jobs: 0, active_projects: 0, data_review: 1, waiting_approval: 4 },
        subjective: { complexity: 4, busy_feeling: 2 },
      },
      Shea: {
        metrics: { sub_jobs: 1, custom_jobs: 0, active_projects: 0, data_review: 4, waiting_approval: 11 },
        subjective: { complexity: 4, busy_feeling: 3 },
      },
    },
  },
  {
    date: '2026-01-13',
    label: 'Week of 1/13/26',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 1, active_projects: 0, data_review: 1, waiting_approval: 1 },
        subjective: { complexity: 1, busy_feeling: 1 },
      },
      Cambrie: {
        metrics: { sub_jobs: 1, custom_jobs: 2, active_projects: 0, data_review: 1, waiting_approval: 2 },
        subjective: { complexity: 0, busy_feeling: 2 },
      },
      Shea: {
        metrics: { sub_jobs: 1, custom_jobs: 0, active_projects: 0, data_review: 0, waiting_approval: 7 },
        subjective: { complexity: 2, busy_feeling: 1 },
      },
    },
  },
  {
    date: '2026-01-20',
    label: 'Week of 1/20/26',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 1, active_projects: 10, data_review: 1, waiting_approval: 1 },
        subjective: { complexity: 1, busy_feeling: 1 },
      },
      Cambrie: {
        metrics: { sub_jobs: 0, custom_jobs: 1, active_projects: 14, data_review: 1, waiting_approval: 2 },
        subjective: { complexity: 1, busy_feeling: 1 },
      },
      Shea: {
        metrics: { sub_jobs: 0, custom_jobs: 3, active_projects: 10, data_review: 0, waiting_approval: 6 },
        subjective: { complexity: 2, busy_feeling: 2 },
      },
    },
  },
  {
    date: '2026-01-27',
    label: 'Week of 1/27/26',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 3, active_projects: 7, data_review: 0, waiting_approval: 2 },
        subjective: { complexity: 2, busy_feeling: 1 },
      },
      Cambrie: {
        metrics: { sub_jobs: 1, custom_jobs: 2, active_projects: 16, data_review: 1, waiting_approval: 2 },
        subjective: { complexity: 2, busy_feeling: 2.5 },
      },
      Shea: {
        metrics: { sub_jobs: 0, custom_jobs: 1, active_projects: 15, data_review: 0, waiting_approval: 4 },
        subjective: { complexity: 2, busy_feeling: 1 },
      },
    },
  },
  {
    date: '2026-02-03',
    label: 'Week of 2/3/26',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 3, active_projects: 5, data_review: 1, waiting_approval: 0 },
        subjective: { complexity: 2, busy_feeling: 1 },
      },
      Cambrie: {
        metrics: { sub_jobs: 0, custom_jobs: 1, active_projects: 15, data_review: 3, waiting_approval: 0 },
        subjective: { complexity: 2, busy_feeling: 1 },
      },
      Shea: {
        metrics: { sub_jobs: 0, custom_jobs: 1, active_projects: 12, data_review: 2, waiting_approval: 4 },
        subjective: { complexity: 2, busy_feeling: 1 },
      },
    },
  },
  {
    date: '2026-02-09',
    label: 'Week of 2/9/26',
    data: {
      Charles: {
        metrics: { sub_jobs: 0, custom_jobs: 2, active_projects: 9, data_review: 1, waiting_approval: 0 },
        subjective: { complexity: 2, busy_feeling: 2 },
      },
      Cambrie: {
        metrics: { sub_jobs: 0, custom_jobs: 1, active_projects: 12, data_review: 3, waiting_approval: 0 },
        subjective: { complexity: 2, busy_feeling: 0 },
      },
      Shea: {
        metrics: { sub_jobs: 0, custom_jobs: 0, active_projects: 11, data_review: 2, waiting_approval: 6 },
        subjective: { complexity: 2, busy_feeling: 2 },
      },
    },
  },
];

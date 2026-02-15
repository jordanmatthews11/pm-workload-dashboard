import {
  BookOpen,
  LayoutDashboard,
  PenSquare,
  Sliders,
  TrendingUp,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  Calculator,
} from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

function Section({ icon: Icon, iconBg, iconColor, title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h3 className="font-semibold text-slate-800 text-left">{title}</h3>
        </div>
        {open ? (
          <ChevronUp className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function Step({ number, children }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ECE5FF] text-[#4E339C] flex items-center justify-center text-xs font-bold mt-0.5">
        {number}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Tip({ children }) {
  return (
    <div className="flex gap-2 bg-[#ECE5FF]/40 rounded-lg p-3 text-sm">
      <Lightbulb className="w-4 h-4 text-[#FFA450] flex-shrink-0 mt-0.5" />
      <span className="text-slate-600">{children}</span>
    </div>
  );
}

export default function HowTo() {
  const { state } = useStore();
  const { config } = state;

  return (
    <div className="space-y-4">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#4E339C] to-[#7554C2] rounded-xl p-6 text-white shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">Welcome to PM Workload</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              This tool helps you track and visualize your project management team's workload week over week.
              Each PM's capacity is scored using quantitative metrics (number of projects, tasks, etc.) combined
              with subjective self-assessments. Below you'll find a quick guide for every feature.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start */}
      <Section
        icon={BookOpen}
        iconBg="bg-[#ECE5FF]"
        iconColor="text-[#4E339C]"
        title="Quick Start — Your First Week"
        defaultOpen={true}
      >
        <p className="font-medium text-slate-700">Follow these steps to get started:</p>
        <div className="space-y-3 mt-2">
          <Step number="1">
            <span className="font-medium text-slate-700">Go to the "Enter Data" tab.</span>{' '}
            Pick today's date (or the Monday of the week) and give it a label like "Week of 2/10/26".
          </Step>
          <Step number="2">
            <span className="font-medium text-slate-700">Expand each PM's section</span> by clicking their name.
            Fill in the quantitative counts (jobs to build, projects in review, etc.) and
            have each PM give their subjective ratings (complexity, "I feel this busy").
          </Step>
          <Step number="3">
            <span className="font-medium text-slate-700">Click "Save Entry".</span>{' '}
            The dashboard will instantly update with scores and a bar chart comparison.
          </Step>
          <Step number="4">
            <span className="font-medium text-slate-700">Come back next week</span> and enter a new week.
            After two weeks of data, the Trends tab lights up with line charts so you can spot patterns.
          </Step>
        </div>
        <Tip>
          Everyone on the team shares the same data in real time — any changes saved by one person
          are immediately visible to everyone else.
        </Tip>
      </Section>

      {/* Dashboard */}
      <Section
        icon={LayoutDashboard}
        iconBg="bg-[#ECE5FF]"
        iconColor="text-[#4E339C]"
        title="Dashboard"
      >
        <p>
          The <strong>Dashboard</strong> shows a snapshot of the <em>most recent week's</em> data:
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-1">
          <li><strong>Summary cards</strong> at the top show team size, the team's average score, and who has the highest workload.</li>
          <li><strong>PM score cards</strong> display each person's Final Score with a color indicator (green = low, orange = moderate, purple = high). If scores changed from the prior week, you'll see an up/down delta.</li>
          <li><strong>Metric breakdown</strong> inside each card shows the raw numbers behind the score.</li>
          <li><strong>Bar chart</strong> at the bottom gives a quick visual comparison across the team.</li>
        </ul>
        <Tip>
          Score colors are relative to the team — the highest scorer sets the scale. A score's color shifts as the team balance changes.
        </Tip>
      </Section>

      {/* Enter Data */}
      <Section
        icon={PenSquare}
        iconBg="bg-[#ECE5FF]"
        iconColor="text-[#7554C2]"
        title="Enter Data"
      >
        <p>This is where you log weekly workload numbers.</p>
        <ul className="list-disc list-inside space-y-1.5 ml-1">
          <li><strong>Week Date</strong> — pick the date for the week you're recording. If an entry already exists for that date, the form auto-fills with the saved values.</li>
          <li><strong>Label</strong> — a friendly name for the week (e.g. "Week of 2/10/26"). This shows up on charts and history.</li>
          <li><strong>PM sections</strong> — click a PM's name to expand their form. You'll see two groups:
            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
              <li><strong>Quantitative Metrics</strong> — number fields for project counts, review items, etc. Each shows its weight in parentheses.</li>
              <li><strong>Subjective Ratings</strong> — slider inputs for self-assessments (e.g. complexity 1-5, "I feel this busy" 1-5).</li>
            </ul>
          </li>
          <li><strong>Live score preview</strong> — as you fill in numbers, the Load Score and Final Score update in real time at the bottom of each PM's section so you can see the formula at work.</li>
          <li><strong>Save Entry</strong> — saves the week's data for all PMs. The button turns green to confirm.</li>
          <li><strong>Reset</strong> (circular arrow) — clears all fields back to zero without saving.</li>
        </ul>
        <Tip>
          You can go back and edit a past week — just change the date picker to the previous week's date, update the numbers, and hit Save.
        </Tip>
      </Section>

      {/* Metrics & Weights */}
      <Section
        icon={Sliders}
        iconBg="bg-[#ECE5FF]"
        iconColor="text-[#4E339C]"
        title="Metrics & Weights"
      >
        <p>This tab lets you customize <em>what</em> you measure and <em>how much</em> each thing matters.</p>

        <div className="mt-2 space-y-4">
          <div>
            <p className="font-medium text-slate-700 mb-1">Quantitative Metrics</p>
            <p>
              These are countable items like "Subscription Jobs to Build" or "In Data Review".
              Each metric has a <strong>weight</strong> that determines how much it contributes to the Load Score.
            </p>
            <ul className="list-disc list-inside ml-1 mt-1 space-y-1">
              <li>Edit a metric's name or weight inline by clicking on it.</li>
              <li>Remove a metric by hovering its row and clicking the trash icon.</li>
              <li>Add a new metric at the bottom — give it a name and weight, then click "Add".</li>
            </ul>
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-1">Subjective Rating Metrics</p>
            <p>
              These are self-reported scales (e.g. 1-5). You can set the min/max range, name, and weight for each.
              They're entered as sliders on the data entry form.
            </p>
          </div>

          <div>
            <p className="font-medium text-slate-700 mb-1">Load Score Weight</p>
            <p>
              This controls how much the Load Score contributes to the Final Score.
              A higher value makes the quantitative metrics more influential relative to the subjective ratings.
            </p>
          </div>
        </div>

        {/* Current formula */}
        <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-[#4E339C]" />
            <p className="font-medium text-slate-700 text-xs uppercase tracking-wider">Current Scoring Formula</p>
          </div>
          <div className="font-mono text-xs space-y-1.5">
            <p>
              <span className="text-[#4E339C] font-semibold">Load Score</span> ={' '}
              {config.metrics.map((m, i) => (
                <span key={m.id}>
                  {i > 0 && ' + '}
                  <span className="text-slate-700">{m.name}</span>
                  <span className="text-slate-400"> x {m.weight}</span>
                </span>
              ))}
            </p>
            <p>
              <span className="text-[#7554C2] font-semibold">Final Score</span> ={' '}
              <span className="text-[#4E339C]">Load Score</span>
              <span className="text-slate-400"> x {config.loadScoreWeight}</span>
              {config.subjectiveMetrics.map((m) => (
                <span key={m.id}>
                  {' + '}
                  <span className="text-slate-700">{m.name}</span>
                  <span className="text-slate-400"> x {m.weight}</span>
                </span>
              ))}
            </p>
          </div>
        </div>

        <Tip>
          Changes to metrics and weights take effect immediately for all new and existing entries — scores
          are always recalculated on the fly using the current formula.
        </Tip>
      </Section>

      {/* Trends */}
      <Section
        icon={TrendingUp}
        iconBg="bg-[#81D994]/15"
        iconColor="text-[#81D994]"
        title="Trends"
      >
        <p>
          The <strong>Trends</strong> tab shows line charts of scores over time.
          You need at least <strong>2 weeks</strong> of data before the charts appear.
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-1">
          <li><strong>Chart type selector</strong> — toggle between Final Score, Load Score, or any individual metric/subjective rating to see that specific value graphed over time.</li>
          <li><strong>Main chart</strong> — an overlay of all PMs on one graph, each in their own color, so you can compare trajectories at a glance.</li>
          <li><strong>Individual PM cards</strong> — area charts below the main chart give each PM their own mini visualization.</li>
        </ul>
        <Tip>
          Use trends to spot PMs who are consistently trending upward — it might be time to redistribute work
          or have a capacity conversation.
        </Tip>
      </Section>

      {/* History */}
      <Section
        icon={Clock}
        iconBg="bg-[#FFA450]/10"
        iconColor="text-[#FFA450]"
        title="History"
      >
        <p>
          A chronological log of every weekly entry (newest first).
        </p>
        <ul className="list-disc list-inside space-y-1.5 ml-1">
          <li><strong>Quick scores</strong> — each row shows the Final Score for every PM at a glance.</li>
          <li><strong>Expand a week</strong> — click any entry to see a full table with every metric, subjective rating, Load Score, and Final Score side by side.</li>
          <li><strong>Delete an entry</strong> — if you need to remove a bad or duplicate week, expand it and click "Delete Entry" (this cannot be undone).</li>
        </ul>
        <Tip>
          History is great for weekly stand-ups — expand the latest entry on screen to review the team's numbers together.
        </Tip>
      </Section>

      {/* Team & Settings */}
      <Section
        icon={Users}
        iconBg="bg-[#ECE5FF]"
        iconColor="text-[#4E339C]"
        title="Team & Settings — Adding / Removing PMs"
      >
        <p>Manage who's tracked in the system.</p>
        <ul className="list-disc list-inside space-y-1.5 ml-1">
          <li><strong>Add a PM</strong> — type their name and click "Add" (or press Enter). They'll immediately appear on the data entry form and dashboard.</li>
          <li><strong>Remove a PM</strong> — hover over their name and click the trash icon. Historical data for that PM in past entries is preserved, but they won't appear in new entries.</li>
          <li><strong>Export Data</strong> — downloads a JSON file of all your configuration, team members, and weekly entries as a backup.</li>
          <li><strong>Import Data</strong> — upload a previously exported JSON file to restore data.</li>
          <li><strong>Reset to Defaults</strong> — wipes everything and resets to the original sample data. Use with caution.</li>
        </ul>
        <Tip>
          Always export a backup before making big changes like removing metrics or resetting data.
        </Tip>
      </Section>

      {/* FAQ */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4 text-sm text-slate-600">
          <div>
            <p className="font-medium text-slate-700">What do the score colors mean?</p>
            <p className="mt-1">
              Green means relatively low workload, orange means moderate, and purple means high.
              Colors are based on each PM's score relative to the highest scorer that week.
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Can I change the metrics after I've already entered data?</p>
            <p className="mt-1">
              Yes. Scores are always recalculated from raw data using the current formula. If you add a new metric,
              past entries will show 0 for that metric. If you change a weight, all historical scores update instantly.
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-700">Is my data shared with the rest of the team?</p>
            <p className="mt-1">
              Yes — everyone who signs in sees the same data in real time. Changes are synced automatically
              so there's no need to manually share files or refresh.
            </p>
          </div>
          <div>
            <p className="font-medium text-slate-700">How often should I enter data?</p>
            <p className="mt-1">
              We recommend once per week — pick a consistent day (e.g. Friday afternoon or Monday morning)
              so the trend data stays evenly spaced.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

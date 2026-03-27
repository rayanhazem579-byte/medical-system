import { useState } from "react";

const sections = [
  "Personal Info",
  "Clinical Status",
  "Medical History",
  "Treatment Plan",
  "Radiology",
];

function Badge({ label, color }: { label: string; color: string }) {
  const colorMap: Record<string, string> = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    red: "bg-red-100 text-red-700 border-red-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold ${colorMap[color]}`}
    >
      {label}
    </span>
  );
}

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-teal-50 text-teal-600">
          {icon}
        </div>
        <h2 className="text-base font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-2.5 border-b border-slate-100 last:border-0">
      <span className="w-52 shrink-0 text-sm font-medium text-slate-500">{label}</span>
      <span className="text-sm text-slate-800 font-medium">{value}</span>
    </div>
  );
}

function VitalCard({
  label,
  value,
  unit,
  icon,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "from-blue-500 to-blue-600 shadow-blue-200",
    teal: "from-teal-500 to-teal-600 shadow-teal-200",
    green: "from-green-500 to-green-600 shadow-green-200",
    orange: "from-orange-500 to-orange-600 shadow-orange-200",
  };
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br ${colorMap[color]} shadow-lg p-5 text-white flex flex-col gap-2`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest opacity-80">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">{icon}</div>
      </div>
      <div className="flex items-end gap-1 mt-1">
        <span className="text-3xl font-bold leading-none">{value}</span>
        <span className="text-sm opacity-75 mb-0.5">{unit}</span>
      </div>
    </div>
  );
}

function TimelineItem({
  date,
  title,
  description,
  type,
}: {
  date: string;
  title: string;
  description: string;
  type: "surgery" | "diagnosis";
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            type === "surgery"
              ? "bg-teal-100 text-teal-600"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {type === "surgery" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
        </div>
        <div className="w-0.5 bg-slate-200 flex-1 my-2" />
      </div>
      <div className="pb-6">
        <p className="text-xs text-slate-400 font-medium mb-1">{date}</p>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function MedicationCard({
  name,
  dose,
  frequency,
  type,
}: {
  name: string;
  dose: string;
  frequency: string;
  type: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
      <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-800">{name}</p>
        <p className="text-xs text-slate-500 mt-0.5">{dose} · {frequency}</p>
        <Badge label={type} color="teal" />
      </div>
    </div>
  );
}

function RadiologyCard({
  date,
  label,
  finding,
  status,
}: {
  date: string;
  label: string;
  finding: string;
  status: "pre" | "post";
}) {
  return (
    <div
      className={`rounded-xl border-2 p-5 ${
        status === "pre"
          ? "border-amber-200 bg-amber-50"
          : "border-green-200 bg-green-50"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            status === "pre" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{date}</p>
          <p className="text-sm font-bold text-slate-800">{label}</p>
        </div>
        <div className="ml-auto">
          <Badge
            label={status === "pre" ? "Pre-Intervention" : "Post-Intervention"}
            color={status === "pre" ? "yellow" : "green"}
          />
        </div>
      </div>
      <p className="text-sm text-slate-700 leading-relaxed">{finding}</p>
    </div>
  );
}

export function App() {
  const [activeSection, setActiveSection] = useState(0);

  const sectionContent = [
    // 0 - Personal Info
    <SectionCard
      key="personal"
      title="Personal & Administrative Information"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
    >
      <div>
        <InfoRow label="Full Name" value="Salem Ali Al-Shehri" />
        <InfoRow label="Age" value="34 Years (DOB: 05/05/1990)" />
        <InfoRow
          label="Medical Record Number"
          value={
            <span className="inline-flex items-center gap-2">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-teal-700 font-bold">#MRN-2024-001</span>
            </span>
          }
        />
        <InfoRow
          label="Blood Type"
          value={<Badge label="O+" color="red" />}
        />
        <InfoRow
          label="Attending Physician"
          value={
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Dr. Khalid Al-Otaibi — Consultant Orthopedic Surgeon
            </span>
          }
        />
      </div>
    </SectionCard>,

    // 1 - Clinical Status
    <div key="clinical" className="space-y-6">
      <SectionCard
        title="Chief Complaint & Symptoms"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      >
        <div>
          <InfoRow
            label="Chief Complaint"
            value="Severe pain in the right hip joint following a fall two weeks ago"
          />
          <InfoRow
            label="Reported Symptoms"
            value="Pain increases with movement & walking, mild swelling, morning stiffness"
          />
          <InfoRow
            label="Primary Diagnosis"
            value={
              <span className="flex items-center gap-2 flex-wrap">
                <Badge label="S72.0" color="red" />
                <span>Fracture of the neck of the femur</span>
              </span>
            }
          />
          <InfoRow
            label="Secondary Diagnosis"
            value={
              <span className="flex items-center gap-2 flex-wrap">
                <Badge label="M16.1" color="purple" />
                <span>Other primary bilateral osteoarthritis</span>
              </span>
            }
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Latest Vital Signs"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        }
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <VitalCard
            label="Blood Pressure"
            value="120/80"
            unit="mmHg"
            color="blue"
            icon={
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          />
          <VitalCard
            label="Pulse Rate"
            value="78"
            unit="bpm"
            color="teal"
            icon={
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <VitalCard
            label="O₂ Saturation"
            value="98"
            unit="%"
            color="green"
            icon={
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <VitalCard
            label="Temperature"
            value="36.8"
            unit="°C"
            color="orange"
            icon={
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            }
          />
        </div>
      </SectionCard>
    </div>,

    // 2 - Medical History
    <div key="history" className="space-y-6">
      <SectionCard
        title="Chronic Conditions"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        }
      >
        <div className="space-y-3">
          {[
            { name: "Diabetes (Type 2)", status: "Monitored", color: "yellow" },
            { name: "Hypertension", status: "Stable", color: "green" },
            { name: "Asthma", status: "Inactive", color: "gray" },
          ].map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                <span className="text-sm font-medium text-slate-700">{c.name}</span>
              </div>
              <Badge label={c.status} color={c.color} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Surgical History"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      >
        <div>
          <TimelineItem
            date="January 14, 2024"
            title="Internal Fixation of Femoral Neck Fracture"
            description="Successful procedure under general anesthesia"
            type="surgery"
          />
          <TimelineItem
            date="March 2018"
            title="Appendectomy"
            description="Performed at King Faisal Hospital"
            type="surgery"
          />
        </div>
      </SectionCard>
    </div>,

    // 3 - Treatment Plan
    <div key="treatment" className="space-y-6">
      <SectionCard
        title="Active Medications"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        }
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <MedicationCard
            name="Solpadeine Effervescent"
            dose="Two tablets"
            frequency="Every 8 hours"
            type="Analgesic"
          />
          <MedicationCard
            name="Augmentin (1g)"
            dose="1g"
            frequency="Twice daily for one week"
            type="Antibiotic"
          />
          <MedicationCard
            name="Adol (500mg)"
            dose="500mg"
            frequency="As needed"
            type="Pain Reliever"
          />
          <MedicationCard
            name="Brufen (400mg)"
            dose="400mg"
            frequency="As needed after meals"
            type="Anti-inflammatory"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Medical Instructions"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        }
      >
        <ul className="space-y-3">
          {[
            {
              text: "Complete rest and non-weight-bearing on the right leg",
              color: "bg-blue-50 border-blue-200 text-blue-700",
              icon: "🛏️",
            },
            {
              text: "Start light physical therapy exercises after 48 hours",
              color: "bg-teal-50 border-teal-200 text-teal-700",
              icon: "🏃",
            },
            {
              text: "Report to the emergency department if swelling increases",
              color: "bg-red-50 border-red-200 text-red-700",
              icon: "🚨",
            },
          ].map((item, i) => (
            <li
              key={i}
              className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-medium ${item.color}`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>,

    // 4 - Radiology
    <SectionCard
      key="radiology"
      title="Radiology Findings"
      icon={
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      }
    >
      <div className="space-y-4">
        <RadiologyCard
          date="January 12, 2024"
          label="X-Ray — Pre-Intervention"
          finding="X-ray shows a complicated femoral neck fracture with slight displacement and significant soft tissue swelling."
          status="pre"
        />
        <RadiologyCard
          date="May 14, 2024"
          label="X-Ray — Post-Intervention"
          finding="X-ray shows complete healing of the fracture with internal fixation supports; disappearance of swelling and bone stability confirmed."
          status="post"
        />
      </div>
    </SectionCard>,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-teal-50">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md shadow-teal-200">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight">Patient Medical Record</h1>
              <p className="text-xs text-slate-400 font-mono">#MRN-2024-001</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge label="Active Patient" color="green" />
            <Badge label="Orthopedics" color="blue" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Patient Hero Card */}
        <div className="rounded-2xl bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white p-6 sm:p-8 shadow-xl shadow-teal-200 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-teal-100 text-sm font-medium mb-1">Patient</p>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Salem Ali Al-Shehri</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1">
                <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                34 Years • 05/05/1990
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1">
                <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Blood Type: O+
              </span>
              <span className="flex items-center gap-1.5 bg-white/15 rounded-lg px-3 py-1">
                <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Dr. Khalid Al-Otaibi
              </span>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-teal-200 text-xs font-medium mb-1">Primary Diagnosis</p>
            <div className="bg-white/20 rounded-xl px-4 py-2">
              <p className="text-white font-bold text-sm">S72.0</p>
              <p className="text-teal-100 text-xs mt-0.5">Femoral Neck Fracture</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {sections.map((s, i) => (
            <button
              key={s}
              onClick={() => setActiveSection(i)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeSection === i
                  ? "bg-teal-600 text-white shadow-md shadow-teal-200"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="animate-fade-in">{sectionContent[activeSection]}</div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400 pb-4 pt-2 border-t border-slate-200">
          This medical record is confidential and intended solely for authorized healthcare providers. · #MRN-2024-001
        </footer>
      </main>
    </div>
  );
}

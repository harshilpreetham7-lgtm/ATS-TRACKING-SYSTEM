import React from 'react';

const RecruiterDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Recruiter Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Pipeline Overview</h2>
            <p className="text-gray-600">
              Track candidates through stages like applied, interviewing, and offered.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-gray-600">Review new applications and update statuses in real time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
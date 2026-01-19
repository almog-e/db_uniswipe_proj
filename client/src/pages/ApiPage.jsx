import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { API_BASE } from "../services/api";
import "./ApiPage.css";

const apiEndpoints = [
  { method: "GET", path: "/api/institutions", desc: "List universities (with query params for filtering)" },
  { method: "GET", path: "/api/institutions/102845?userId=201", desc: "Get university by ID (programs ordered by user preferences, example userId=201)" },
  { method: "GET", path: "/api/users", desc: "List users" },
  { method: "GET", path: "/api/states", desc: "List states" },
  { method: "GET", path: "/api/programs", desc: "List program names" },
  { method: "GET", path: "/api/degreeType", desc: "List degree types" },
  { method: "GET", path: "/api/analytics/programs/highestAdmissionRate/3", desc: "Analytics: highest admission rate (example)" },
  { method: "GET", path: "/api/user_pref/201", desc: "Get user preferences (example userId=201)" },
  { method: "PUT", path: "/api/user_pref/201", desc: "Update user preferences (example userId=201, body: { preferred_region: 'CA', preferred_degree_type: 'Bachelor's Degree', preferred_field_category: 'psychology', min_roi: 58.08 })" },
  { method: "POST", path: "/api/account_check/login", desc: "User login" },
];

export default function ApiPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [results, setResults] = useState({});
  const [userPrefs, setUserPrefs] = useState(null);

  React.useEffect(() => {
    if (user && user.user_id) {
      fetch(`${API_BASE}/api/user_pref/${user.user_id}`)
        .then((res) => res.json())
        .then(setUserPrefs)
        .catch(() => setUserPrefs(null));
    }
  }, [user]);

  const handleTest = async (endpoint) => {
    let url = endpoint.path;
    if (!url.startsWith("http")) url = API_BASE + url;
    let options = { method: endpoint.method };
    let body = null;
    if (endpoint.method === "PUT") {
      options.headers = { "Content-Type": "application/json" };
      body = JSON.stringify({
        preferred_region: "CA",
        preferred_degree_type: "Bachelor's Degree",
        preferred_field_category: "Computer Science.",
        min_roi: 58.08
      });
      options.body = body;
    }
    if (endpoint.method === "POST" && endpoint.path === "/api/account_check/login") {
      options.headers = { "Content-Type": "application/json" };
      body = JSON.stringify({ email: "test@test.com", password: "123456" });
      options.body = body;
    }
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      setResults((prev) => ({ ...prev, [endpoint.path]: text }));
    } catch (e) {
      setResults((prev) => ({ ...prev, [endpoint.path]: "Error: " + e.message }));
    }
  };

  return (
    <div className="api-page-container">
      <button
        className="api-return-btn"
        onClick={() => navigate(-1)}
      >
        ← Return
      </button>
      <h1>API Endpoints</h1>
      {user && (
        <div style={{ marginBottom: 18 }}>
          <b>Current User Preferences:</b>
          {userPrefs ? (
            <pre className="api-result-pre" style={{ marginTop: 6 }}>{JSON.stringify(userPrefs, null, 2)}</pre>
          ) : (
            <span style={{ marginLeft: 8 }}>Loading...</span>
          )}
        </div>
      )}
      <p>This page documents all available API calls for the UniSwipe backend. Click "Test" to try each endpoint.</p>
      <ul>
        {apiEndpoints.map((ep, i) => (
          <li key={ep.path} style={{ marginBottom: 18 }}>
            <b>{ep.method} {ep.path}</b> — {ep.desc}
            <button
              className="api-test-btn"
              onClick={() => handleTest(ep)}
            >
              Test
            </button>
            {results[ep.path] && (
              <pre className="api-result-pre">{results[ep.path]}</pre>
            )}
          </li>
        ))}
      </ul>
      <p>For detailed request/response formats, see the backend route files.</p>
      <hr style={{margin: '32px 0'}} />
      <div>
        <h2>Query Documentation: HomePage & AnalyticsPage</h2>
        <h3>HomePage Queries</h3>
        <ul>
          <li>
            <b>All Universities (mode=1):</b><br />
            <span className="api-doc-query-example">GET /api/institutions?mode=1&amp;userId=USER_ID&amp;offset=OFFSET&amp;limit=10</span><br />
            Shows all universities in the database, paginated. Excludes universities the user has already matched with. (Dropdown: "All Universities")
          </li>
          <li>
            <b>In Your Region (mode=2):</b><br />
            <span className="api-doc-query-example">GET /api/institutions?mode=2&amp;userId=USER_ID&amp;offset=OFFSET&amp;limit=10</span><br />
            Shows only universities in the user's region, based on their profile or preferences. Excludes already matched universities. (Dropdown: "In Your region")
          </li>
          <li>
            <b>By Degree Field (mode=3):</b><br />
            <span className="api-doc-query-example">GET /api/institutions?mode=3&amp;userId=USER_ID&amp;offset=OFFSET&amp;limit=10</span><br />
            Shows universities that offer the user's selected degree field. Excludes already matched universities. (Dropdown: "By Degree field")
          </li>
          <li>
            <b>By Preference Algorithm (mode=4):</b><br />
            <span className="api-doc-query-example">GET /api/institutions?mode=4&amp;userId=USER_ID&amp;offset=OFFSET&amp;limit=10</span><br />
            Shows universities ranked by a custom algorithm using all of the user's saved preferences (region, degree, field, etc.). Excludes already matched universities. (Dropdown: "By Preference Algorithm")
          </li>
          <li>
            <b>High Admission Rate (&gt;50%) (mode=5):</b><br />
            <span className="api-doc-query-example">GET /api/institutions?mode=5&amp;userId=USER_ID&amp;offset=OFFSET&amp;limit=10</span><br />
            Shows only universities with an admission rate above 50%. Excludes already matched universities. (Dropdown: "High Admission Rate (&gt;50%)")
          </li>
        </ul>
        <div className="api-doc-query-note">
          <b>Mode Values (HomePage select dropdown):</b>
          <ul>
            <li><b>1 - All Universities:</b> All universities in the database.</li>
            <li><b>2 - In Your region:</b> Universities in the user's region.</li>
            <li><b>3 - By Degree field:</b> Universities matching the user's degree field.</li>
            <li><b>4 - By Preference Algorithm:</b> Universities ranked by all user preferences.</li>
            <li><b>5 - High Admission Rate (&gt;50%):</b> Universities with admission rate above 50%.</li>
          </ul>
          <b>Note:</b> All queries exclude universities the user has already matched with (client-side filtering), are paginated (<b>offset</b> increases by 10, <b>limit</b> is always 10), and require <b>userId</b> for filtering and matching logic.
          <br /><b>Returned Data:</b> Each query returns an array of university objects with fields such as <code>id</code>, <code>name</code>, <code>state</code>, <code>city</code>, <code>public_private</code>, <code>sat_avg</code>, <code>act_avg</code>, <code>admission_rate</code>, <code>site_url</code>, etc.
        </div>
        <h3>AnalyticsPage Queries</h3>
        <ul>
          <li><b>GET /api/analytics/programs/highestAdmissionRate/:limit</b><br />Top programs with the highest average admission rate.</li>
          <li><b>GET /api/analytics/insititutions/HighestRoi/:limit</b><br />Top institutions with the highest return on investment (ROI) per cost.</li>
          <li><b>GET /api/analytics/states/programs/avgRoi/:limit</b><br />Average ROI for each program by state (minimum 5 samples).</li>
          <li><b>GET /api/analytics/programs/highestAvgEarn/:limit</b><br />Programs with the highest average earnings growth (Year 1 to Year 2).</li>
          <li><b>GET /api/analytics/programs/highestSalary/:limit</b><br />Programs with the highest average salary one year after graduation.</li>
          <li><b>GET /api/analytics/programs/lowestRoi/:limit</b><br />Programs with the lowest ROI scores.</li>
          <li><b>GET /api/analytics/programs/lowestSalary/:limit</b><br />Programs with the lowest average salary two years after graduation.</li>
          <li><b>GET /api/analytics/states/intitutions/highestRoi/:limit</b><br />Most profitable university in every state.</li>
          <li><b>GET /api/analytics/programs/intitutions/highestRoi/:limit</b><br />Most profitable university for each field of study.</li>
          <li><b>GET /api/analytics/users/averageGpa/:userId</b><br />GPA rankings for the user.</li>
        </ul>
      </div>
    </div>
  );
}

import assert from "node:assert";

const BASE_URL = "http://localhost:3005";

async function runE2ETest() {
  console.log("=== STARTING FULL END-TO-END VERIFICATION ===");

  // 1. Check Homepage
  console.log("1. Checking Homepage (GET /)...");
  const homeRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(homeRes.status, 200, "Homepage should return 200");
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes("استوديو ألوان الشعار"), "Homepage must contain SEU studio title");
  console.log("✔ Homepage rendered successfully with SEU branding.");

  // 2. Check Customization Page
  console.log("2. Checking Customizer Page (GET /customize)...");
  const custRes = await fetch(`${BASE_URL}/customize`);
  assert.strictEqual(custRes.status, 200, "Customize page should return 200");
  const custHtml = await custRes.text();
  assert(custHtml.includes("اعتماد الاقتراح") || custHtml.includes("customize"), "Customize page should render successfully");
  console.log("✔ Customize page rendered successfully.");

  // 3. Submit a new Proposal via API
  console.log("3. Creating a new Proposal (POST /api/proposals)...");
  const proposalPayload = {
    title: "مقترح الهوية الملكية الحديثة",
    submitterName: "المهندس ضياء",
    submitterEmail: "dhiaa@seu.edu.sa",
    notes: "دمج متوازن بين العنابي الملكي والأخضر الزمردي والذهبي الفاخر",
    design: {
      logoVersion: "2026-v1",
      background: {
        type: "gradient",
        gradient: {
          enabled: true,
          type: "linear",
          angle: 135,
          stops: [
            { color: "#531B23", offset: 0 },
            { color: "#1E293B", offset: 100 }
          ]
        }
      },
      parts: {
        symbol_y: { color: "#C59B27" }, // Gold
        symbol_e: { color: "#1B4D3E" }, // Emerald
        symbol_u: { color: "#1B4D3E" }, // Emerald
        symbol_squares: { color: "#C59B27" }, // Gold
        text_arabic: { color: "#FFFFFF" }, // White
        text_english: { color: "#E2E8F0" } // Platinum
      }
    }
  };

  const createRes = await fetch(`${BASE_URL}/api/proposals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(proposalPayload)
  });
  const createData = await createRes.json();
  assert.strictEqual(createRes.status, 201, `Proposal creation failed: ${JSON.stringify(createData)}`);
  const publicId = createData.publicId;
  console.log(`✔ Proposal created successfully with Public ID: ${publicId}`);
  assert(/^LC-[A-Z0-9]{6}$/.test(publicId), `Public ID ${publicId} must follow LC-XXXXXX format`);

  // Grab visitor session cookie
  const rawSetCookie = (typeof createRes.headers.getSetCookie === "function") 
    ? createRes.headers.getSetCookie() 
    : [createRes.headers.get("set-cookie") || ""];
  const allCookies = rawSetCookie.join("; ");
  const cookieMatch = allCookies.match(/seu_visitor_id=([^;]+)/);
  const visitorCookie = cookieMatch ? `seu_visitor_id=${cookieMatch[1]}` : "seu_visitor_id=v_1234567890abcdef1234567890abcdef";
  console.log(`Visitor cookie received: ${cookieMatch ? "YES" : "SIMULATED"}`);

  // 4. Check Proposal Details API & Page (GET /api/proposals/[id] & GET /proposals/[id])
  console.log(`4. Fetching Proposal Details (GET /api/proposals/${publicId})...`);
  const detailApiRes = await fetch(`${BASE_URL}/api/proposals/${publicId}`, {
    headers: { Cookie: visitorCookie }
  });
  assert.strictEqual(detailApiRes.status, 200, "Proposal API should return 200");
  const detailData = await detailApiRes.json();
  assert.strictEqual(detailData.proposal.publicId, publicId);
  assert.strictEqual(detailData.proposal.isLocked, true, "Proposal must be locked and immutable");
  console.log(`✔ Proposal API returned locked snapshot: ${publicId} (isLocked: true)`);

  const detailPageRes = await fetch(`${BASE_URL}/proposals/${publicId}`, {
    headers: { Cookie: visitorCookie }
  });
  assert.strictEqual(detailPageRes.status, 200, "Proposal detail page should return 200");
  console.log("✔ Proposal detail page rendered properly.");

  // 5. Test Liking the proposal
  console.log("5. Testing Like toggle (POST /api/proposals/[id]/like)...");
  const likeRes1 = await fetch(`${BASE_URL}/api/proposals/${publicId}/like`, {
    method: "POST",
    headers: { Cookie: visitorCookie }
  });
  assert.strictEqual(likeRes1.status, 200);
  const likeData1 = await likeRes1.json();
  assert.strictEqual(likeData1.liked, true);
  assert.strictEqual(likeData1.likesCount, 1);
  console.log("✔ Like registered (count: 1).");

  // Toggle like off
  const likeRes2 = await fetch(`${BASE_URL}/api/proposals/${publicId}/like`, {
    method: "POST",
    headers: { Cookie: visitorCookie }
  });
  const likeData2 = await likeRes2.json();
  assert.strictEqual(likeData2.liked, false);
  assert.strictEqual(likeData2.likesCount, 0);
  console.log("✔ Like un-toggled cleanly (count: 0).");

  // Re-like for analytics test
  await fetch(`${BASE_URL}/api/proposals/${publicId}/like`, {
    method: "POST",
    headers: { Cookie: visitorCookie }
  });

  // 6. Test Single-Vote enforcement
  console.log("6. Testing Single-Vote rule (POST /api/proposals/[id]/vote)...");
  const voteRes1 = await fetch(`${BASE_URL}/api/proposals/${publicId}/vote`, {
    method: "POST",
    headers: { Cookie: visitorCookie }
  });
  assert.strictEqual(voteRes1.status, 200);
  const voteData1 = await voteRes1.json();
  assert.strictEqual(voteData1.success, true);
  assert.strictEqual(voteData1.votesCount, 1);
  console.log("✔ First vote recorded successfully (votesCount: 1).");

  // Attempt duplicate vote from same visitor session
  const voteRes2 = await fetch(`${BASE_URL}/api/proposals/${publicId}/vote`, {
    method: "POST",
    headers: { Cookie: visitorCookie }
  });
  assert.strictEqual(voteRes2.status, 400, "Duplicate vote must be rejected with 400");
  const voteData2 = await voteRes2.json();
  assert(voteData2.error.includes("لقد قمت بالتصويت"), "Duplicate vote error message must match requirement");
  console.log("✔ Duplicate vote blocked strictly (Single-vote rule verified).");

  // 7. Test Adding a Comment
  console.log("7. Testing Comment submission (POST /api/proposals/[id]/comments)...");
  const commentRes = await fetch(`${BASE_URL}/api/proposals/${publicId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: visitorCookie },
    body: JSON.stringify({
      userName: "سارة الأحمد",
      content: "تناسق ألوان مذهل، يعطي انطباعاً عصرياً راقياً لشعار الجامعة السعودية الإلكترونية!"
    })
  });
  const commentData = await commentRes.json();
  assert([200, 201].includes(commentRes.status), `Comment submission failed: ${JSON.stringify(commentData)}`);
  assert.strictEqual(commentData.comment.userName, "سارة الأحمد");
  console.log("✔ Comment published and attached to proposal.");

  // 8. Check Results Page
  console.log("8. Checking Results Analytics (GET /api/results & GET /results)...");
  const resultsApiRes = await fetch(`${BASE_URL}/api/results`);
  assert.strictEqual(resultsApiRes.status, 200);
  const resultsData = await resultsApiRes.json();
  assert(resultsData.summary.totalProposals >= 1, "Should have at least 1 proposal");
  assert(resultsData.summary.totalVotes >= 1, "Should have at least 1 vote");
  assert(resultsData.topColors.length > 0, "Top colors should be populated");
  console.log(`✔ Results API returns: ${resultsData.summary.totalProposals} proposals, ${resultsData.summary.totalVotes} votes, ${resultsData.topColors.length} top colors.`);

  const resultsPageRes = await fetch(`${BASE_URL}/results`);
  assert.strictEqual(resultsPageRes.status, 200);
  console.log("✔ Results page rendered successfully.");

  // 9. Check Admin Authentication
  console.log("9. Testing Admin Login (POST /api/admin/login)...");
  const adminLoginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@seu.edu.sa",
      password: "AdminSEU@2026!"
    })
  });
  const adminData = await adminLoginRes.json();
  assert.strictEqual(adminLoginRes.status, 200, `Admin login failed: ${JSON.stringify(adminData)}`);
  assert.strictEqual(adminData.success, true);
  
  const adminRawCookies = (typeof adminLoginRes.headers.getSetCookie === "function")
    ? adminLoginRes.headers.getSetCookie()
    : [adminLoginRes.headers.get("set-cookie") || ""];
  const adminAllCookies = adminRawCookies.join("; ");
  const adminCookieMatch = adminAllCookies.match(/seu_admin_token=([^;]+)/);
  const adminCookie = adminCookieMatch ? `seu_admin_token=${adminCookieMatch[1]}` : "";
  console.log(`✔ Admin logged in successfully: ${adminData.admin.email}`);

  // 10. Check Admin Dashboard & Proposal Management
  console.log("10. Testing Admin Proposals API (GET & PATCH /api/admin/proposals)...");
  const adminProposalsRes = await fetch(`${BASE_URL}/api/admin/proposals`, {
    headers: { Cookie: adminCookie }
  });
  assert.strictEqual(adminProposalsRes.status, 200);
  const adminProposalsData = await adminProposalsRes.json();
  assert(adminProposalsData.proposals.length > 0, "Admin proposals list must not be empty");
  console.log(`✔ Admin fetched ${adminProposalsData.proposals.length} proposals.`);

  // Test admin dashboard pages
  const dashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Cookie: adminCookie }
  });
  assert.strictEqual(dashRes.status, 200, "Admin dashboard should return 200 for authenticated admin");
  console.log("✔ Admin dashboard rendered successfully.");

  console.log("\n==========================================");
  console.log("🎉 ALL E2E VERIFICATION CHECKS PASSED!");
  console.log("==========================================");
}

runE2ETest().catch((err) => {
  console.error("❌ E2E TEST FAILED:", err);
  process.exit(1);
});

import { serverStore } from '../src/lib/serverStore';

async function runE2ETests() {
  console.log('=== STARTING ORION 14-POINT END-TO-END VERIFICATION ===\n');
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string, extra = '') {
    totalCount++;
    if (condition) {
      console.log(`[PASS ${totalCount}] ${testName}`);
      passedCount++;
    } else {
      console.error(`[FAIL ${totalCount}] ${testName} -> ${extra}`);
    }
  }

  try {
    // 1. Register Team Alpha
    console.log('\n--- TEST STEP 1: Register Team Alpha ---');
    const alphaPayload = {
      teamName: 'CyberNovas Alpha',
      problemStatement: 'CYBER-01',
      institution: 'Sathyabama Institute of Science and Technology',
      department: 'Computer Science',
      year: '3rd Year',
      leaderName: 'Arjun Sharma',
      leaderEmail: 'arjun.sharma@testgenesis.org',
      leaderPhone: '9876543210',
      members: [
        {
          name: 'Priya Sundar',
          email: 'priya.sundar@testgenesis.org',
          phone: '9876543211',
          department: 'Information Technology',
          year: '3rd Year'
        }
      ]
    };

    const regAlpha = await serverStore.registerTeam(alphaPayload);
    const teamAlpha = regAlpha.team;
    assert(!!teamAlpha.registration_id && teamAlpha.registration_id.startsWith('ORION-2026-'), 'Generated valid Team ID format: ' + teamAlpha.registration_id);
    assert(!!teamAlpha.access_token && teamAlpha.access_token.startsWith('PASS-'), 'Generated secure access passcode: ' + teamAlpha.access_token);
    assert(teamAlpha.payment_status === 'NOT_SUBMITTED', 'Payment status is NOT_SUBMITTED before UTR');
    assert(teamAlpha.round_1_status === 'NOT_STARTED', 'Round 1 status initialized as NOT_STARTED');
    assert(teamAlpha.round_2_status === 'LOCKED', 'Round 2 status initialized as LOCKED');

    // Submit Payment UTR for Team Alpha
    console.log('\n--- TEST STEP 1b: Submit Payment UTR ---');
    const uniqueUtr = 'UTR_' + Date.now();
    const paymentResult = await serverStore.submitPayment(teamAlpha.id, {
      utrNumber: uniqueUtr,
      payerName: 'Arjun Sharma',
      amount: 400
    });
    assert(paymentResult.success === true, 'Payment submission succeeded');
    const teamAlphaAfterPayment = await serverStore.getTeam(teamAlpha.id);
    assert(teamAlphaAfterPayment?.payment_status === 'PENDING', 'Payment status updated to PENDING after submitting UTR');

    // 2. Duplicate UTR Rejection Test
    console.log('\n--- TEST STEP 2: Duplicate UTR Detection ---');
    const betaPayload = {
      teamName: 'Duplicate Test Squad',
      problemStatement: 'AI-01',
      institution: 'Anna University',
      leaderName: 'Vikram Patel',
      leaderEmail: 'vikram.patel@other.org',
      leaderPhone: '9123456789',
      members: [
        {
          name: 'Rohan Verma',
          phone: '9123456788'
        }
      ]
    };
    const regBeta = await serverStore.registerTeam(betaPayload);
    // Attempt to submit identical UTR
    const duplicateRes = await serverStore.submitPayment(regBeta.team.id, {
      utrNumber: uniqueUtr,
      payerName: 'Vikram Patel',
      amount: 400
    });
    assert(duplicateRes.success === false, 'Duplicate UTR was rejected: ' + duplicateRes.error);

    // 3. Duplicate Participant Anomaly & Suspicion Flagging
    console.log('\n--- TEST STEP 3: Suspicious Registration Flagging ---');
    const gammaPayload = {
      teamName: 'Shadow Syndicate',
      problemStatement: 'AI-02',
      institution: 'Sathyabama University',
      leaderName: 'Arjun Clone',
      leaderEmail: 'arjun.sharma@testgenesis.org', // REUSED EMAIL
      leaderPhone: '9876543210',                  // REUSED PHONE
      members: [
        {
          name: 'Clone Member',
          phone: '9876543219'
        }
      ]
    };
    const regGamma = await serverStore.registerTeam(gammaPayload);
    const teamGamma = regGamma.team;
    assert((teamGamma.suspicion_flags?.length || 0) > 0, 'Team registered with duplicate participant flagged with suspicion flags');
    assert(!!teamGamma.suspicion_flags && teamGamma.suspicion_flags.length > 0, 'Suspicion details tagged: ' + teamGamma.suspicion_flags?.[0]?.description);

    // 4. Authenticate Team via Portal Credentials
    console.log('\n--- TEST STEP 4: Team Authentication & Lookup ---');
    const authResult = await serverStore.authenticateTeam(teamAlpha.registration_id, teamAlpha.access_token);
    assert(authResult !== null && authResult?.id === teamAlpha.id, 'Authenticated successfully with Team ID + Passcode');

    // 5. Admin Payment Verification
    console.log('\n--- TEST STEP 5: Admin Payment Verification ---');
    const verifyResult = await serverStore.updatePaymentVerification(
      teamAlpha.id,
      'VERIFY',
      'Finance Jury',
      'Bank statement confirmed by accounts team'
    );
    assert(verifyResult.team.payment_status === 'VERIFIED', 'Payment status updated to VERIFIED');
    assert(verifyResult.team.round_1_status === 'SUBMISSION_OPEN', 'Round 1 status automatically unlocked to SUBMISSION_OPEN');

    // 6. Round 1 Native Submission Upload
    console.log('\n--- TEST STEP 6: PPT / PDF Submission Upload ---');
    const submissionResult = await serverStore.submitRound1File(teamAlpha.id, {
      originalFilename: 'orion_cybernovas_alpha_presentation.pptx',
      fileUrl: '/uploads/submissions/sample_alpha.pptx',
      fileSize: 2450000,
      fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    });
    assert(submissionResult.success === true, 'Submission succeeded');
    assert(submissionResult.submission?.version === 1, 'Submission recorded as version 1');
    const teamAfterSub = await serverStore.getTeam(teamAlpha.id);
    assert(teamAfterSub?.round_1_status === 'SUBMITTED', 'Team status transitioned to SUBMITTED');

    // 7. Admin Evaluation & Round 2 Unlock
    console.log('\n--- TEST STEP 7: Admin Jury Evaluation & Round 2 Unlock ---');
    const evalResult = await serverStore.evaluateRound1(
      teamAlpha.id,
      'SELECT',
      'Chief Jury Member',
      94,
      'Outstanding architecture, high impact, ready for Grand Finale.'
    );
    assert(evalResult.team.round_1_status === 'SELECTED', 'Round 1 status updated to SELECTED');
    assert(evalResult.team.round_2_status === 'ACCESS_GRANTED', 'Round 2 status automatically unlocked to ACCESS_GRANTED');
    assert(evalResult.team.round_1_score === 94, 'Evaluation score recorded accurately: 94/100');

    // 8. Final Team Portal State Verification
    console.log('\n--- TEST STEP 8: Final Team Portal View Verification ---');
    const finalTeam = await serverStore.getTeam(teamAlpha.id);
    assert(finalTeam?.round_2_status === 'ACCESS_GRANTED', 'Portal confirms Round 2 Finale briefing accessible');
    assert(finalTeam?.submissions?.length === 1, 'Portal displays submitted artifact');

    // 9. Telemetry & Metrics Verification
    console.log('\n--- TEST STEP 9: Telemetry & Audit Trail Verification ---');
    const overview = await serverStore.getAdminOverview();
    assert(overview.stats.totalRegistrations >= 2, 'Telemetry tracks total registrations: ' + overview.stats.totalRegistrations);
    assert(overview.stats.round1Selected >= 1, 'Telemetry tracks selected finalists: ' + overview.stats.round1Selected);
    assert(overview.stats.paymentVerified >= 1, 'Telemetry tracks verified payments: ' + overview.stats.paymentVerified);

    console.log(`\n=== VERIFICATION COMPLETE: ${passedCount} / ${totalCount} TESTS PASSED ===\n`);
  } catch (err) {
    console.error('CRITICAL UNEXPECTED ERROR IN VERIFICATION:', err);
  }
}

runE2ETests();

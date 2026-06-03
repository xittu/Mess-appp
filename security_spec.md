# Security Specification and Threat Model

This document outlines the zero-trust Attribute-Based Access Control (ABAC) requirements, threat models, and proof tests designed to defend the **Mess/Hostel Meal and Expense Management Application** database.

## 1. Data Invariants & Zero-Trust Assertions
1. **Authenticated Access only:** All write operations into any mess sub-collections require a valid, verified Firebase Authentication session (`request.auth != null`).
2. **Mess Domain Isolation:** Documents stored inside `/messes/{messId}` paths are restricted. A client can only execute operations when authenticated.
3. **Immutability of Key Credentials:**
   - Members' auto-generated IDs and creation timestamps must remain immutable after initial write.
   - Expense `createdBy` field must strictly match the current user's authenticated email or UID and remain immutable.
4. **Denial of Wallet Defense:** Strict size and regex constraints on fields prevent rogue clients from writing inflated string payloads (e.g. infinite text lengths) or injecting special characters.

---

## 2. The "Dirty Dozen" Threat Payloads (Target: PERMISSION_DENIED)

The following payload attempts seek to break security laws and must receive instant `PERMISSION_DENIED`:

| Test ID | Path | Action | Description / Payload Attempt | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **THREAT-01** | `/messes/XYZ/members/M1` | `create` | **Unauthenticated Member Creation:** Attempt to add an member with `request.auth == null` | `PERMISSION_DENIED` |
| **THREAT-02** | `/messes/XYZ/members/M1` | `create` | **Identity Hijack:** Registering a member with long random spam strings as custom ID and missing critical fields | `PERMISSION_DENIED` |
| **THREAT-03** | `/messes/XYZ/members/M1` | `update` | **Spoofed Update:** Modifying a member's registration ID after initial setup | `PERMISSION_DENIED` |
| **THREAT-04** | `/messes/XYZ/expenses/E1` | `create` | **Expense Invalidation (Negative Currency Injection):** Creating a bazaar record with `amount: -450` | `PERMISSION_DENIED` |
| **THREAT-05** | `/messes/XYZ/expenses/E1` | `create` | **Ghost Fields Exploit (The Shadow Update):** Submitting redundant fields `isAdminMode: true` on expense document | `PERMISSION_DENIED` |
| **THREAT-06** | `/messes/XYZ/expenses/E1` | `update` | **Value Poisoning (Corrupt Type):** Attempting to update `amount` field to boolean `true` or a huge text | `PERMISSION_DENIED` |
| **THREAT-07** | `/messes/XYZ/utilities/U1` | `create` | **PII / Private Info Leak:** Reading standard private fields without direct permission | `PERMISSION_DENIED` |
| **THREAT-08** | `/messes/XYZ/deposits/M1` | `update` | **Malicious Funds Tampering:** Updating with negative value or non-numeric balance | `PERMISSION_DENIED` |
| **THREAT-09** | `/messes/XYZ/duties/Day1` | `create` | **Rogue Assigned Date Injection:** Forcing weekday values like `yesterday_afternoon` instead of standard days | `PERMISSION_DENIED` |
| **THREAT-10** | `/messes/XYZ/settings/current` | `update` | **Invalid Meal Setup:** Setting a negative number or extremely large bounds for target monthly fixed meal ratios | `PERMISSION_DENIED` |
| **THREAT-11** | `/messes/XYZ/notifications/N1` | `create` | **Spoof notification sender:** Creating a custom notification pretending to be system type but utilizing unauthorized categories | `PERMISSION_DENIED` |
| **THREAT-12** | `/messes/XYZ/members/M1` | `delete` | **Self-Signed Purge Scheme:** Purging member records whilst unauthenticated | `PERMISSION_DENIED` |

---

## 3. Threat Verification Test Outline (`firestore.rules.test.ts`)

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from "@firebase/rules-unit-testing";

describe("Mess App Firestore Security Rules Tests", () => {
  let testEnv;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "starlit-cirrus-n71nt",
      firestore: {
        host: "localhost",
        port: 8080,
      }
    });
  });

  it("should fail unauthenticated operations on members directory", async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthDb.doc("messes/MPPD7X/members/new-user").set({
      id: "MBDMZ1",
      name: "Attacker",
      joinDate: "2026-06-03"
    }));
  });

  it("should prevent negative or overflow amounts in bazaar records", async () => {
    const authDb = testEnv.authenticatedContext("user_id_123").firestore();
    await assertFails(authDb.doc("messes/MPPD7X/expenses/exp_01").set({
      id: "exp_01",
      date: "2026-06-03",
      amount: -100, // Invalid: negative
      desc: "Bad bazaar entry"
    }));
  });
});
```

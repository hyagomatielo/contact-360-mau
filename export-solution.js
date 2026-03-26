/**
 * export-solution.js — Export Customer360Prod solution from Dynamics 365 as an unmanaged ZIP
 */
const msal = require("@azure/msal-node");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const CRM_BASE_URL = "https://hyagom.crm.dynamics.com";
const API_URL = CRM_BASE_URL + "/api/data/v9.2";
const PUBLIC_CLIENT_ID = "51f81489-12ee-4a9e-aaae-a2591f45987d";
const SOLUTION_NAME = "Customer360Prod";
const OUTPUT_FILE = path.join(__dirname, SOLUTION_NAME + ".zip");
const CACHE_FILE = path.join(__dirname, ".msal-cache.json");
const SHARED_CACHE = path.join(__dirname, "..", "customer360", ".msal-cache.json");

async function authenticate() {
    const pca = new msal.PublicClientApplication({
        auth: {
            clientId: PUBLIC_CLIENT_ID,
            authority: "https://login.microsoftonline.com/organizations",
        },
    });

    for (const cachePath of [CACHE_FILE, SHARED_CACHE]) {
        if (fs.existsSync(cachePath)) {
            pca.getTokenCache().deserialize(fs.readFileSync(cachePath, "utf-8"));
            break;
        }
    }

    const accounts = await pca.getTokenCache().getAllAccounts();
    if (accounts.length > 0) {
        try {
            const result = await pca.acquireTokenSilent({
                scopes: [CRM_BASE_URL + "/.default"],
                account: accounts[0],
            });
            console.log("Authenticated silently as: " + accounts[0].username);
            fs.writeFileSync(CACHE_FILE, pca.getTokenCache().serialize());
            return result.accessToken;
        } catch (e) {
            // Fall through to device code flow.
        }
    }

    const result = await pca.acquireTokenByDeviceCode({
        scopes: [CRM_BASE_URL + "/.default"],
        deviceCodeCallback: (resp) => console.log(resp.message),
    });
    console.log("Authenticated as: " + result.account.username);
    fs.writeFileSync(CACHE_FILE, pca.getTokenCache().serialize());
    return result.accessToken;
}

async function exportSolution(token) {
    console.log("Exporting solution: " + SOLUTION_NAME + " ...");
    const res = await fetch(API_URL + "/ExportSolution", {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            Accept: "application/json",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
        },
        body: JSON.stringify({ SolutionName: SOLUTION_NAME, Managed: false }),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error("Export failed (" + res.status + "): " + err);
    }

    const data = await res.json();
    const buffer = Buffer.from(data.ExportSolutionFile, "base64");
    fs.writeFileSync(OUTPUT_FILE, buffer);
    console.log("Saved: " + OUTPUT_FILE + " (" + Math.round(buffer.length / 1024) + " KB)");
}

(async () => {
    try {
        const token = await authenticate();
        await exportSolution(token);
        console.log("Done!");
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
})();
export function validateCredentials(credentials) {
    let credentialErrors = {}

    for (const cred in credentials) {
        if (!credentials[cred]) {
            credentialErrors[cred] = true;
        } else {
            credentialErrors[cred] = false;
        }
    }

    return credentialErrors;
}
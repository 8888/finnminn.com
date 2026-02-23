# Gradle Build Issues & Troubleshooting

This guide documents common issues encountered during Gradle builds in CI/CD and local development, and provides solutions to prevent them.

## GitHub Actions: `ETIMEDOUT` during Wrapper Validation

### Problem
In GitHub Actions workflows, the `gradle/actions/wrapper-validation` action (or deprecated `gradle/wrapper-validation-action`) may fail with the following errors:
- `Error: Error 0: connect ETIMEDOUT 104.16.73.101:443`
- `Error: connect ENETUNREACH 2606:4700::6810:4865:443`

### Cause
This occurs because the validation action attempts to contact `services.gradle.org` (hosted on Cloudflare) to verify the checksum of the `gradle-wrapper.jar`. Since many GitHub Actions runners share the same IP addresses, Cloudflare frequently rate-limits or blocks these IPs, causing the connection to time out.

### Solution
1. **Use `setup-gradle@v4`**: Always use the official `gradle/actions/setup-gradle@v4` action. It is more robust and handles wrapper validation implicitly.
2. **Remove Dedicated Validation Steps**: Remove any explicit `gradle/actions/wrapper-validation` steps from your workflows.
3. **Disable Validation if Persistent**: If the timeout continues even with `setup-gradle@v4`, you can explicitly disable wrapper validation in the action configuration, though this is less secure:
   ```yaml
   - name: Setup Gradle
     uses: gradle/actions/setup-gradle@v4
     with:
       validate-wrappers: false
   ```

## Best Practices
- **Prefer `setup-gradle` for caching**: Do not use the `cache: 'gradle'` option in `actions/setup-java`. Instead, use `gradle/actions/setup-gradle` which provides a more specialized and reliable caching mechanism for Gradle.
- **Keep Gradle Wrapper Up-to-Date**: Periodically update the Gradle wrapper to the latest version to benefit from security fixes and performance improvements.

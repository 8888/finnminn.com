# Example: Setting up Pip for local testing

1. **Bootstrap the environment**:
   ```bash
   ./.agents/skills/local_env/scripts/manage_env.sh bootstrap
   ```

2. **Start the Pip backend**:
   ```bash
   ./.agents/skills/local_env/scripts/manage_env.sh start_backend pip
   ```

3. **Start the Pip frontend**:
   ```bash
   ./.agents/skills/local_env/scripts/manage_env.sh start_frontend pip
   ```

4. **Verify connectivity**:
   ```bash
   curl -I http://localhost:7071/api/hello
   ```

5. **Open Browser**:
   - Navigate to `http://localhost:5173`.
   - The app should be running with mock authentication.

---
description: Start the local development environment for a specific app.
---

1. Use the `Local Environment Manager` skill to bootstrap the environment.
2. Prompt the user for which app they want to run (e.g., `pip`, `necrobloom`, `web`, or `all`) if not obvious from context.
3. Use the skill scripts to start the backend and frontend for the selected app, or use `start_all` for the full suite.
4. Verify the services are running by polling the APIs and checking logs.
5. Provide the local URLs to the user based on the port map:
   - Pip: http://localhost:5173
   - Necrobloom: http://localhost:5174
   - Web: http://localhost:5175

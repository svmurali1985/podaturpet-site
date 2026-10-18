PODATURPET GLOBAL WEBSITE UPDATE — 20 SEPTEMBER 2026

This package was prepared from your uploaded website(20260920-025920).zip.
It has not been published. Keep your current website folder and apply the patch there.

1. Extract this ZIP into Downloads. You should have:
   ~/Downloads/Podaturpet-Global-Update/redesign.patch
2. Open Terminal inside your existing website Git repository.
3. Run the following commands one at a time. If a check fails, STOP and share the error; do not force it.

git status --short
git apply --check ~/Downloads/Podaturpet-Global-Update/redesign.patch
git apply ~/Downloads/Podaturpet-Global-Update/redesign.patch
git diff --check
git add --pathspec-from-file="$HOME/Downloads/Podaturpet-Global-Update/changed-files.txt"
git diff --cached --check
git commit -m "Improve Podaturpet global homepage languages SEO and buyer enquiries"
git push origin main

Do not use git add . if you have unrelated work. Review already-staged changes before committing.
Do not copy this entire release package into your public website. Apply the patch above.
The updated-files folder is a reference copy of exactly the changed website files, not a complete standalone website.

Preview locally after applying:
python3 -m http.server 8000
Open http://localhost:8000/ in a browser. Press Ctrl+C to stop the server.

New pages:
/index-ta.html
/wholesale-lungi-enquiry.html
/ai-chatbot-development.html
/business-workflow-automation.html

Read AUDIT-AND-RELEASE.md for testing evidence and remaining language limitations.
Read KEYWORD-MAP.md for the SEO phrases and their destination pages.
Google ranking and enquiry growth are not guaranteed. No keyword-volume figures were invented.
Some older reference content uses the full-page Google Tamil translation fallback; it is not all manually translated.
After publication, inspect the new URLs and submit the updated sitemap in Google Search Console.

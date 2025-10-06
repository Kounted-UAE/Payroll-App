# GitHub Command Reference

A quick reference for the most common Git and GitHub commands.

---

## 🧭 1. Initial Setup

```bash
git init                   # Initialize a new local repo
git clone <repo-url>        # Clone an existing GitHub repo
git remote -v               # Show remote URLs
git remote add origin <url> # Link local repo to GitHub
```

---

## 🌿 2. Branch Management

```bash
git branch                  # List branches
git branch <name>           # Create new branch
git checkout <name>         # Switch branch
git checkout -b <name>      # Create + switch in one command
git merge <branch>          # Merge branch into current one
git branch -d <name>        # Delete local branch
```

---

## 💾 3. Staging & Committing Changes

```bash
git status                  # Show changed files
git add .                   # Stage all changes
git add <file>              # Stage specific file(s)
git commit -m "Message"     # Commit staged changes
```

---

## 🚀 4. Pushing to GitHub

```bash
git push origin main        # Push local main to GitHub
git push -u origin main     # Set upstream (first push)
git push origin <branch>    # Push branch
```

> 💡 **Tip:** The `-u` flag links your local branch with the remote one, so later you can just use `git push` or `git pull` without specifying the remote/branch.

---

## ⬇️ 5. Pulling & Syncing

```bash
git pull origin main        # Pull latest changes from main
git fetch                   # Download updates (without merging)
git merge origin/main       # Merge fetched main changes
```

---

## 🧹 6. Reset, Undo, & Clean Up

```bash
git restore <file>          # Undo unstaged changes
git reset HEAD <file>       # Unstage file but keep changes
git reset --hard HEAD~1     # Undo last commit (⚠️ destructive)
git clean -fd               # Remove untracked files/folders
```

---

## 🏷️ 7. Tagging & Releases

```bash
git tag                     # List tags
git tag v1.0.0              # Create lightweight tag
git push origin v1.0.0      # Push tag to GitHub
```

---

## 🔍 8. Useful Logs & History

```bash
git log --oneline --graph   # Compact commit history
git diff                    # See unstaged changes
git show <commit>           # Show details of a commit
```

---

## 🔐 9. Authentication

```bash
gh auth login               # Use GitHub CLI for login
git config user.name "Your Name"
git config user.email "your@email.com"
```

---

## 🧠 Pro Tips

- Use `git stash` to temporarily save uncommitted changes.
- Use `gh` CLI for managing issues and pull requests directly from the terminal.
- Always pull before pushing to avoid merge conflicts.

---

© 2025 GitHub Command Reference | Maintained by Eben Johansen

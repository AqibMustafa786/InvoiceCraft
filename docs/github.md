# How to Push Your Code to GitHub

This guide covers how to push your project to a new GitHub repository for the first time, and how to push subsequent updates.

---

## Pushing Updates (For Most Cases)

After you've set up the repository, pushing updates is simple. Follow these steps every time you want to save your changes to GitHub.

### Step 1: Add Changes to Staging
This prepares your modified files for the next commit.
```bash
git add .
```

### Step 2: Commit Your Changes
Save your changes with a descriptive message.
```bash
git commit -m "Your descriptive message here (e.g., Fix build errors)"
```

### Step 3: Push to GitHub
Upload your new commit to the repository.
```bash
git push
```

---

## Pushing for the First Time (Initial Setup)

If you are setting up a brand new repository, follow these commands step-by-step.

### Step 1: Initialize Git Repository
This command creates a new git repository in your project folder.
```bash
git init -b main
```

### Step 2: Add All Files to Staging
This command prepares all your project files to be saved in the repository.
```bash
git add .
```

### Step 3: Commit the Files
This command saves the files in your repository with a message.
```bash
git commit -m "Initial commit"
```

### Step 4: Add the New Remote Repository
This command tells git where your new repository is located on GitHub. **Make sure to replace the URL with your own repository URL.**
```bash
git remote add origin https://github.com/AqibMustafa786/InvoiceCraft.git
```
_Note: If you get an error that says "remote origin already exists", it means a remote is already configured. You can either remove it with `git remote remove origin` and add the new one, or just proceed to the next step if it's the correct repository._

### Step 5: Push Your Code to GitHub
This command uploads your committed code to the `main` branch. The `-u` flag sets it as the default, so for future updates you can just use `git push`.
```bash
git push -u origin main
```

After running these commands, refresh your GitHub page, and you should see your latest changes!

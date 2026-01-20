# How to Push Your Code to a New GitHub Repository

Follow these commands step-by-step in your terminal to push your project to your new GitHub repository.

### Step 1: Initialize Git Repository
This command creates a new git repository in your project folder. If you already have a `.git` folder, you can skip this, but running it again is safe.

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
This command tells git where your new repository is located on GitHub.

```bash
git remote add origin https://github.com/AqibMustafa786/InvoiceCraft.git
```
_Note: If you get an error that says "remote origin already exists", run this command first to remove the old one: `git remote remove origin`_

### Step 5: Push Your Code to GitHub
This command uploads your committed code to the `main` branch of your new repository. The `-u` flag sets it as the default, so for future updates you can just use `git push`.

```bash
git push -u origin main
```

After running these commands, refresh your GitHub page, and you should see all your project files there!

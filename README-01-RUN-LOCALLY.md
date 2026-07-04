# 01 Run Locally

## Required Software

- Google Chrome
- Visual Studio Code
- git
- Git Credential Manager
- Node.js
- pnpm
- OrbStack

---

## Install Homebrew

Go to:

```text
https://brew.sh
```

Install Homebrew using the command shown on that page.

Open a new terminal.

Check Homebrew:

```bash
brew --version
```

---

## Install Software With Homebrew

```bash
brew install --cask google-chrome
brew install --cask visual-studio-code
brew install --cask git-credential-manager
brew install --cask orbstack
brew install git
brew install node
brew install pnpm
```

Open OrbStack once and let it finish setting up.

---

## Configure Git

Open a new terminal.

```bash
git-credential-manager configure
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

---

## Check Versions

```bash
git --version
node --version
pnpm --version
docker --version
```

OrbStack provides the `docker` command used by the local scripts.

---

## Clone The Repo

```bash
mkdir -p ~/src
git clone https://github.com/RichardBrayProjects/143-starter-local-development-aws-system.git ~/src/143-starter-local-development-aws-system
```

Open this folder in Visual Studio Code:

```text
~/src/143-starter-local-development-aws-system
```

Install packages from the repo root terminal:

```bash
pnpm install
```

---

## Run Locally

Start local database:

```bash
pnpm run local:start
```

Start the server:

```bash
pnpm run dev:server
```

Open a new repo root terminal.

Start the frontend:

```bash
pnpm run dev:web
```

Open:

```text
http://localhost:5173
```

---

## Stop Local Mode

Stop local database:

```bash
pnpm run local:stop
```

Stop server/frontend terminals with:

```text
Ctrl-C
```

---

## Clean Packages

Remove installed package folders and generated package output:

```bash
pnpm run package-cleanup
```

Short alias:

```bash
pnpm run package-clean
```

Next:

```text
README-02-RUN-IN-AWS.md
```

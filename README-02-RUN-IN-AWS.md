# 02 Run In AWS

Complete this first:

```text
README-01-RUN-LOCALLY.md
```

This file assumes:

```text
the repo has been cloned
pnpm install has been run
the app runs locally
```

## Additional Required Software

- AWS CLI
- AWS CDK CLI

---

## Install AWS Software With Homebrew

```bash
brew install awscli
brew install aws-cdk
```

---

## Check Versions

```bash
aws --version
cdk --version
```

---

## Create AWS IAM User

Open:

```text
https://console.aws.amazon.com/
```

Go to:

```text
IAM -> Users -> Create user
```

Use:

```text
User name: starter-admin
Provide user access to the AWS Management Console: no
```

Press:

```text
Next
```

Choose:

```text
Attach policies directly
AdministratorAccess
```

Press:

```text
Next
Create user
```

Open the new user:

```text
Security credentials -> Create access key
```

Choose:

```text
Command Line Interface (CLI)
I understand the above recommendation and want to proceed to create an access key
```

Press:

```text
Next
Create access key
```

Copy:

```text
Access key
Secret access key
```

---

## Configure AWS CLI

```bash
aws configure
```

Use:

```text
AWS Access Key ID: paste the access key
AWS Secret Access Key: paste the secret access key
Default region name: eu-west-2
Default output format: json
```

Check AWS:

```bash
aws sts get-caller-identity
```

---

## Deploy To AWS

Bootstrap CDK:

```bash
pnpm run bootstrap-up
```

Deploy:

```bash
pnpm run deploy
```

Show the cloud URL:

```bash
pnpm run url
```

Open the URL shown by the command.

---

## Delete From AWS

```bash
pnpm run destroy
```

---

## Clean Packages

```bash
pnpm run package-cleanup
```

Short alias:

```bash
pnpm run package-clean
```

# Zomi Youth Development - Next.js Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

Ensure you have the following installed on your development machine:

- [Node.js](https://nodejs.org/) (version 14.x or later)
- [npm](https://www.npmjs.com/) (version 6.x or later) or [yarn](https://yarnpkg.com/) (version 1.x or later)
- [pnpm](https://pnpm.io/) (optional)
- [bun](https://bun.sh/) (optional)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kmung/zomiyd.git
   cd zomiyd
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Running the Development Server

To start the development server, run:

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

## Branching and Pull Requests

### 1. Creating a Branch for Each New Feature

Always create a new branch for each feature or bug fix you are working on. Never work directly on the main branch.

    ```bash
    git checkout -b feature-name
    ```

### 2. Committing Changes

Commit new changes with a descriptive message.

    ```bash
    git add .
    git commit -m "Commit message"
    ```

### 3. Pushing Changes

    ```bash
    git push origin feature-name
    ```

### 4. Submitting a Pull Request

Go to the repository on GitHub and you will see a prompt to create a pull request for your recently pushed branch. Follow these steps:

- Click on the "Compare & pull request" button.
- Add a title and description for your pull request.
- Ensure the base branch is main and the compare branch is your feature branch.
- Click on "Create pull request".

## Project Structure

- app/: Contains the main application components and pages.
- public/: Contains public assets such as images and icons.
- styles/: Contains global styles and Tailwind CSS configuration.
- next.config.ts: Next.js configuration file.
- tsconfig.json: TypeScript configuration file.
- postcss.config.mjs: PostCSS configuration file.
- .eslintrc.json: ESLint configuration file.

## Environment Variables

To connect this Next.js application to your Strapi instance, you need to configure environment variables.

1.  Create a new file named `.env.local` in the root of your project.
2.  Copy the contents of `.env.example` into `.env.local`.
3.  Modify the variables in `.env.local` to point to your Strapi API:

    - `NEXT_PUBLIC_STRAPI_URL`: The full base URL for your Strapi API
    - `STRAPI_API_TOKEN` (Optional): If your Strapi API requires an authentication token to access the newsletter content, provide it here. Note that the current code in `lib/api.ts` does not yet use this token, but it can be added if needed.

Make sure `.env.local` is included in your `.gitignore` file to prevent committing sensitive information.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Setup

To install:
`git clone https://github.com/ryanlee4761/choreom8.git`

In your terminal:
`npm install`

To run:
`npm run dev`

# Making changes
Always `git pull main` or `git pull [branchname]`

Ensure you're on the right branch
```
git branch -a # list all branches
git checkout [branchname]
```

When you're done with a change:
```
git add .
# or git add [path/filename]

git commit -m "[commit details]"
git push origin [branchname]
```
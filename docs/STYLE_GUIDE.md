# Style Guides

## Getting Started

In order to run this app locally, you should have the following programs installed on your computer:

- [Node.js](https://nodejs.org/) version 22.0.0 or higher
- [pnpm](https://yarnpkg.com/) version 9.4.0 or higher

##### Clone this repository

```
git clone https://github.com/techstudioconsults/bytealley.git
cd bytealley
```

##### Install dependencies

```
pnpm install
```

##### Start the server

```
pnpm run dev
```

## Colors

##### Navigate to

```
htpp://localhost:4200/guides
```

## Components

##### Navigate to

```
htpp://localhost:3000/guides
```

## Prerequisites

- Follow all folder and file structure formats
- Use the provided global alias for all imports, `~/*` representing `./src/*`
  ```
  "paths": {
    "~/*": [
      "./src/*"
    ]
  },
  ```
- Use the global CSS variables
- Use Tailwind CSS and bytealley components exclusively.
- UI general components should be stored in `~/components`
- Page specific components should be stored in the page component folder
- Modal components should be stored in `~/components/modals`
- Layout components should be stored in `~/components/layouts`
- All tests should be created in their page folder level upwards e.g
  - landing-routes
    - home
      - page.tsx
      - components
      - views
      - test (this test folder is used for only the home page)

## Contributing

Please read the [CONTRIBUTING](./CONTRIBUTING.md) file before making any contributions.

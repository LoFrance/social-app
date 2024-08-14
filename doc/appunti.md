### Monorepo

quando crei un packages, crei un package.json simile a:

```
{
  "name": "@lfapp/shared-globals-handlers",
  "main": "./src/index.ts"
}
```

poi lo installi nel workspace di interesse:

```
npm i @lfapp/shared-globals-handlers --workspace=backend
```

potrebbe essere necessario fare un:

```
npm i
```

nella root del monorepo.
## mp


```bash
$ apollo schema:download --endpoint="http://localhost:9654/api/v2/graphql" --header="Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjIifQ.fKL6TTl9POtMymFl7EEkobMvnzAODPZy97MxjgKL3Io"
$ apollo codegen:generate --target=typescript --localSchemaFile="./src/schema/schema.json" --includes="./src/schema/**/*.graphql" --useReadOnlyTypes
```

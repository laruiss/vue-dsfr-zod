import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import YAML from 'yaml'

const app = express()
const port = 3003

// Charger le fichier Swagger YAML
const file = fs.readFileSync(path.join(import.meta.dirname, './openapi-docs.yml'), 'utf8')
const swaggerDocument = YAML.parse(file)

// Servir Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`)
  console.log(`Swagger UI disponible sur http://localhost:${port}/api-docs`)
})

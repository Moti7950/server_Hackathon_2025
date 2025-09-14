import serverIntelligenceAttack from "./src/app.js"
const PORT = 6578

serverIntelligenceAttack.listen(PORT, ()=> console.log(`Server running on port ${PORT}`)
)
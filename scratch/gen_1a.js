const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/app/data/school-cycles.data.ts');
let fileContent = fs.readFileSync(filePath, 'utf8');

const regex = /export const SAN_MIGUEL_CYCLES_1B: Record<string, CycleDayInfo> = (\{[\s\S]*?\});/m;
const match = fileContent.match(regex);

if (match) {
  let objStr = match[1];
  let newObjStr = objStr.replace(/diaCiclo: (\d)/g, (match, p1) => {
    let day = parseInt(p1);
    let isRed = (day === 2 || day === 4 || day === 5);
    let uniform = isRed ? "'rojo'" : "'gris'";
    return `diaCiclo: ${day} }__MARKER__`; 
  });
  
  const lines = newObjStr.split('\n');
  const processedLines = lines.map(line => {
    if (line.includes('}__MARKER__')) {
       let match2 = line.match(/diaCiclo:\s*(\d)/);
       if (match2) {
          let day = parseInt(match2[1]);
          let isRed = (day === 2 || day === 4 || day === 5);
          let uniform = isRed ? "'rojo'" : "'gris'";
          
          line = line.replace(/educacionFisica:\s*(true|false),\s*uniforme:\s*'[^']+'/, `educacionFisica: ${isRed}, uniforme: ${uniform}`);
          if (day === 5) {
             if (line.includes('eventoEspecial:')) {
                line = line.replace(/eventoEspecial:\s*'([^']+)'/, "eventoEspecial: '$1 / Día de Juguetes'");
             } else {
                line = line.replace('}', ", eventoEspecial: 'Día de Juguetes' }");
             }
          }
       }
       return line.replace('}__MARKER__', '');
    }
    return line;
  });
  
  const finalStr = `\n// Mapeo para 1A: Día 2, 4 y 5 -> Rojo, Día 1, 3, 6 -> Gris, Día 5 -> Juguetero\nexport const SAN_MIGUEL_CYCLES_1A: Record<string, CycleDayInfo> = ${processedLines.join('\n')};\n`;
  fs.appendFileSync(filePath, finalStr);
  console.log("Appended SAN_MIGUEL_CYCLES_1A successfully.");
} else {
  console.log("Could not find SAN_MIGUEL_CYCLES_1B");
}

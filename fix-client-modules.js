const fs = require('fs');
const path = require('path');

const clientModulesPath = path.join(__dirname, 'docs-site', '.docusaurus', 'client-modules.js');

if (fs.existsSync(clientModulesPath)) {
  let content = fs.readFileSync(clientModulesPath, 'utf8');

  // Replace require() calls with ES module imports
  content = content.replace(
    /export default \[([\s\S]*?)\];/,
    (match, modules) => {
      const imports = [];
      const requireRegex = /require\(["']([^"']+)["']\)/g;
      let importIndex = 0;

      modules = modules.replace(requireRegex, (requireMatch, modulePath) => {
        const importName = `module${importIndex++}`;
        imports.push(`import '${modulePath}';`);
        return importName;
      });

      return imports.join('\n') + '\n\nexport default [' + modules + '];';
    }
  );

  fs.writeFileSync(clientModulesPath, content);
  console.log('Fixed client-modules.js to use ES modules');
} else {
  console.log('client-modules.js not found');
}
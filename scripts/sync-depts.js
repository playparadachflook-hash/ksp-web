const fs = require('fs');
const path = require('path');

async function main() {
  const fileContent = fs.readFileSync(path.join(__dirname, '../js/departments.js'), 'utf8');
  const match = fileContent.match(/const DEFAULT_DEPARTMENTS_LIST = (\[[\s\S]*?\]);\s*const DEPARTMENTS_LIST/);
  if (!match) {
    console.error('Could not find DEFAULT_DEPARTMENTS_LIST in js/departments.js');
    process.exit(1);
  }

  const depts = eval(match[1]);
  console.log(`Found ${depts.length} clinics. Syncing to CMS API...`);

  const response = await fetch('http://127.0.0.1:3088/api/cms?action=save_section', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      section_key: 'departments',
      section_name: 'แผนกและคลินิก',
      section_data: depts,
      username: 'admin'
    })
  });

  const json = await response.json();
  console.log('CMS Sync response:', json);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

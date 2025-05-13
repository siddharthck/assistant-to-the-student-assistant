export function extractEventMetadata(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  function getValueMatchingLabel(labelFragment) {
    const allLabels = Array.from(doc.querySelectorAll('dt'));
    for (const dt of allLabels) {
      if (dt.textContent.toLowerCase().includes(labelFragment.toLowerCase())) {
        return dt.nextElementSibling?.textContent.trim() || '';
      }
    }
    return '';
  }

  const email = getValueMatchingLabel("email");
  const isSJSU = email.toLowerCase().endsWith("@sjsu.edu");

  const mediaNotes = getValueMatchingLabel("media notes");
  const hasMediaNotes = mediaNotes.length > 0;

  const internalNoteRows = doc.querySelectorAll('#notes-table tbody tr');
  const hasInternalNotes = internalNoteRows.length > 0;

  let hybridRaw = getValueMatchingLabel("hybrid");
  let isHybrid = false;
  if (hybridRaw.toLowerCase().startsWith("yes") || hybridRaw.toLowerCase().includes("live zoom")) {
    isHybrid = true;
  }

  return {
    isHybrid,
    hasMediaNotes,
    hasInternalNotes,
    isSJSU,
    email,
    mediaNotes
  };
}

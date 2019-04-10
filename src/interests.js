/**
* Calculates total interest sum
* @param {} jsonData
*/
module.exports.getTotalSum = (jsonData) => {
  const statementEntries = jsonData.data.summary.statementEntryGroups;

  if (!statementEntries) {
    return 0;
  }

  const balanceStatementEntryTypes = [
    '17', // Interest received
    '46', // Interest income on rebuy
    '117', // Refer a friend bonus
  ];

  let interests = 0;

  for (let i = 0; i < balanceStatementEntryTypes.length; i += 1) {
    const entryType = balanceStatementEntryTypes[i];

    if (statementEntries.hasOwnProperty(entryType)) {
      interests += parseFloat(statementEntries[entryType]);
    }
  }

  return interests;
};

(async () => {
  const { runWithCouncil } = require('./council.js');
  const out = await runWithCouncil('@aiden: Say hi from Soulfield');
  console.log(out);
})();

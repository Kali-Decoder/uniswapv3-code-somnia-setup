const config = {
    wstt: '0xF22eF0085f6511f70b01a68F360dCc56261F768a',
    factoryAddress: '0xDf580DB7c33b2ca7311f6FDD5758547C63EAc751',
    managerAddress: '0x4B9d17663F8c89B3D34C612Ea686009f395069D2',
    quoterAddress: '0x10Cf27FfE5202A62f11CD07cE710153981A6d9f7',
  };
  config.tokens = {};
  config.tokens[config.wstt] = { symbol: 'WSTT' };
  config.tokens['0xDa4FDE38bE7a2b959BF46E032ECfA21e64019b76'] = { symbol: 'USDTG' };
  config.tokens['0x4eF3C7cd01a7d2FB9E34d6116DdcB9578E8f5d58'] = { symbol: 'PUMPAZ' };
  config.tokens['0xF2F773753cEbEFaF9b68b841d80C083b18C69311'] = { symbol: 'NIA' };
  config.tokens['0xA356306eEd1Ec9b1b9cdAed37bb7715787ae08A8'] = { symbol: 'CHECK' };
  
  export default config;
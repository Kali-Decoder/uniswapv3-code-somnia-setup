const config = {
  wethAddress: '0x378dCbC55DA11778051b8CDc9C466A6f21193e7f',
  factoryAddress: '0x0dd37f45432785ecc82450372b213e747c4b3a79',
  managerAddress: '0xa206f0cAabDB2e7EE4B4832372B4a4aEf4A565dD',
  quoterAddress: '0x07f83C1bA2b65214b44A4D8d18a0995802d1013E',
  ABIs: {
    'ERC20': require('./abi/ERC20.json'),
    'Factory': require('./abi/Factory.json'),
    'Manager': require('./abi/Manager.json'),
    'Pool': require('./abi/Pool.json'),
    'Quoter': require('./abi/Quoter.json')
  }
};

config.tokens = {};
config.tokens[config.wethAddress] = { symbol: 'WETH' };
config.tokens['0xdC7bC73519e62Be1e7ceE28399D9b503015b479b'] = { symbol: 'UNI' };
config.tokens['0x39b4F910F1dAd6aFE65E3fb7E3B29d066b693905'] = { symbol: 'WBTC' };
config.tokens['0xCe4366844F86c0A2B15996B60b5AAc418E7B8416'] = { symbol: 'USDT' };
config.tokens['0xdc569a93da5Eb978a212a1DA646d0D181E49d386'] = { symbol: 'USDC' };

export default config;
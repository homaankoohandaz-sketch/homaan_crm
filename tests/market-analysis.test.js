import assert from 'node:assert/strict';
import {compareGold,compareDollar,scenarioForecast,riskFlags} from '../src/domains/finance/market-analysis.js';
assert.equal(compareGold(1000,10).propertyValueInGoldGrams,100);
assert.equal(compareDollar(1000,10).propertyValueInDollars,100);
assert.equal(scenarioForecast([{base:100,growth:.1,periods:2}])[0].projected,121);
assert.deepEqual(riskFlags({margin:-1,dataFreshnessDays:31}),['negative_margin','stale_market_data']);
console.log('market-76-90: passed');

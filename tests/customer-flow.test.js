import assert from 'node:assert/strict';
import { createSharePackage, interpretCustomerResponse } from '../src/domains/crm/customer-flow.js';

const pkg = createSharePackage({
  propertyId: 42,
  advisorId: 'advisor-1',
  title: 'پیشنهاد ملک',
  message: 'لطفاً فایل را بررسی کنید.',
  expiresInHours: 48
});
assert.equal(pkg.propertyId, 42);
assert.equal(pkg.advisorId, 'advisor-1');
assert.equal(pkg.status, 'sent');
assert.ok(pkg.expiresAt);

assert.equal(interpretCustomerResponse('بله، مورد تایید است').status, 'approved');
assert.equal(interpretCustomerResponse('نه، نمی‌خواهم').status, 'rejected');
assert.equal(interpretCustomerResponse('لطفاً قیمت نهایی را بفرستید').status, 'question');
assert.equal(interpretCustomerResponse('علاقه دارم بیشتر بدانم').status, 'interested');

console.log('customer-flow.test.js: PASS');

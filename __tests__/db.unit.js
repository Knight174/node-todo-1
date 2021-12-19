const db = require('../db');

describe('db', () => {
  it('can read', () => {
    expect(db.read instanceof Function).toBe(true);
  }),
  it('can write', () => {
    expect(db.write instanceof Function).toBe(true);
  })
})
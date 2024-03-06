import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest'
import { app } from '../src/app'
import request from 'supertest'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(async () => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new transaction', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 5000,
        type: 'credit',
      })
      .expect(201)
  })

  it('should be able to list all transactions', async () => {
    const createTransaction = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransaction.get('Set-Cookie')

    const listTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactions.body.transactions).toEqual([
      expect.objectContaining({ title: 'Test Transaction', amount: 5000 }),
    ])
  })

  it('should be able to get one transactions', async () => {
    const createTransaction = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransaction.get('Set-Cookie')

    const listTransactions = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const transactionId = listTransactions.body.transactions[0].id

    const findTransaction = await request(app.server)
      .get(`/transactions/${transactionId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(findTransaction.body.transaction).toEqual(
      expect.objectContaining({ title: 'Test Transaction', amount: 5000 }),
    )
  })

  it('should be able to get a transactions summary', async () => {
    const creditTransaction = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Test Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = creditTransaction.get('Set-Cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Test Transaction',
        amount: 2000,
        type: 'debit',
      })

    const getSummary = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)

    expect(getSummary.body.summary).toEqual({ amount: 3000 })
  })

  afterAll(async () => {
    await app.close()
  })
})

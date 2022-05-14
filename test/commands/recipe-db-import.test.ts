import {expect, test} from '@oclif/test'

describe('recipe-db-import', () => {
  test
  .stdout()
  .command(['recipe-db-import'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['recipe-db-import', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})

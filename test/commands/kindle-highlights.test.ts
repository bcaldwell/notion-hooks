import {expect, test} from '@oclif/test'

describe('kindle-highlights', () => {
  test
  .stdout()
  .command(['kindle-highlights'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['kindle-highlights', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})

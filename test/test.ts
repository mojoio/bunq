import { expect, tap } from '@pushrocks/tapbundle';
import * as bunq from '../ts/index'

tap.test('first test', async () => {
  console.log(bunq.standardExport)
})

tap.start()

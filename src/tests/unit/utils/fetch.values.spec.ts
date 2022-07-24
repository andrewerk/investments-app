// import sinon from 'sinon';
// import { assert, expect } from 'chai';
// import finnHubClient from '../../../utils/finnHubClient';

// const nodeFetchPath = require.resolve('node-fetch');
// const nodeFetchModule = require.cache[nodeFetchPath];
// assert(nodeFetchModule);

// describe('Test finnHubClient', async () => {
//   it('Test', () => {
//     sinon.stub(nodeFetchModule, 'exports')
//       .returns(
//  new Promise((resolve) => resolve(new Response({ c: 1 } as any, { status: 200 }))));
//   });
//   const result = await finnHubClient.fetchValues('string');
//   expect(result.statusCode).to.eql(201);
// });

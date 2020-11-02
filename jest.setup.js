// File jest.setup.js

// fetch is only in browser so jest needs something loaded
// https://github.com/facebook/jest/issues/2071#issuecomment-396771463
// TODO we might be able to use "isomorphic-unfetch" which is also installed
import "whatwg-fetch";
